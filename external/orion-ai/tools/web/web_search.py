#!/usr/bin/env python3
"""
🌐 WEB SEARCH TOOL - Orion AI
Búsqueda web con ranking de relevancia usando Bing RSS.
"""

import re
import html
from typing import List, Dict
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
import unicodedata

import requests


class WebSearchTool:
    """Herramienta de búsqueda web sin API key"""

    def __init__(self, timeout: int = 15):
        self.timeout = timeout
        self.search_url = "https://www.bing.com/search"
        self.blocked_domains = {
            "zh.hinative.com",
            "es.hinative.com",
            "hinative.com",
            "spanishdict.com",
            "wordreference.com",
            "italki.com",
            "duolingo.com",
        }
        self.trusted_domains = {
            "samsung.com",
            "gsmarena.com",
            "sammobile.com",
            "androidauthority.com",
            "theverge.com",
            "cnet.com",
            "xataka.com",
            "techradar.com",
            "tomsguide.com",
            "phonearena.com",
            "notebookcheck.net",
            "wikipedia.org",
            "reuters.com",
            "bbc.com",
        }
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        }

    def _normalize(self, text: str) -> str:
        normalized = unicodedata.normalize("NFKD", text.lower())
        normalized = "".join(ch for ch in normalized if not unicodedata.combining(ch))
        normalized = re.sub(r"\s+", " ", normalized).strip()
        return normalized

    def _is_launch_intent(self, query: str) -> bool:
        q = self._normalize(query)
        patterns = [
            "cuando sale",
            "fecha de lanzamiento",
            "fecha lanzamiento",
            "fecha de salida",
            "cuando se lanza",
            "release date",
            "launch date",
        ]
        return any(pattern in q for pattern in patterns)

    def _extract_focus_terms(self, query: str) -> List[str]:
        q = self._normalize(query)
        q = re.sub(
            r"\b(busca|buscar|investiga|investigar|consulta|en internet|en la web|en web|en google)\b",
            " ",
            q,
        )
        q = re.sub(
            r"\b(cuando sale|cuando se lanza|fecha de lanzamiento|fecha lanzamiento|fecha de salida|release date|launch date)\b",
            " ",
            q,
        )
        words = [w for w in re.findall(r"[a-z0-9]+", q) if len(w) >= 3]
        return words

    def _build_queries(self, query: str) -> List[str]:
        cleaned = query.strip()
        launch_intent = self._is_launch_intent(cleaned)
        focus_terms = self._extract_focus_terms(cleaned)
        focus = " ".join(focus_terms).strip()

        query_candidates = [cleaned]
        if launch_intent and focus:
            query_candidates.extend([
                f"{focus} release date",
                f"{focus} launch date",
                f"fecha lanzamiento {focus}",
                f"{focus} official announcement",
            ])

        deduped = []
        seen = set()
        for candidate in query_candidates:
            key = self._normalize(candidate)
            if key and key not in seen:
                seen.add(key)
                deduped.append(candidate)
        return deduped[:4]

    def _domain(self, url: str) -> str:
        netloc = urlparse(url).netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc

    def _is_blocked(self, domain: str) -> bool:
        return any(domain == blocked or domain.endswith(f".{blocked}") for blocked in self.blocked_domains)

    def _is_trusted(self, domain: str) -> bool:
        return any(domain == trusted or domain.endswith(f".{trusted}") for trusted in self.trusted_domains)

    def _score_result(self, result: Dict[str, str], focus_terms: List[str], launch_intent: bool) -> int:
        text = self._normalize(f"{result.get('title', '')} {result.get('snippet', '')}")
        domain = self._domain(result.get('url', ''))
        score = 0

        if self._is_blocked(domain):
            score -= 30
        if self._is_trusted(domain):
            score += 10

        for term in focus_terms:
            if term in text:
                score += 4

        launch_keywords = [
            "release", "launch", "announcement", "announced", "unpacked",
            "fecha", "lanzamiento", "salida", "presentacion"
        ]
        if launch_intent and any(keyword in text for keyword in launch_keywords):
            score += 8

        noisy_patterns = [
            "que significa", "what does", "difference between", "有什么不一样",
            "是什么意思", "hinative", "grammar", "pronunciation"
        ]
        if any(pattern in text for pattern in noisy_patterns):
            score -= 20

        return score

    def _clean_text(self, value: str) -> str:
        clean = re.sub(r"<[^>]+>", "", value)
        clean = html.unescape(clean)
        clean = re.sub(r"\s+", " ", clean).strip()
        return clean

    def _fetch_rss(self, query: str) -> List[Dict[str, str]]:
        response = requests.get(
            self.search_url,
            params={"q": query, "format": "rss", "setlang": "es"},
            headers=self.headers,
            timeout=self.timeout,
        )
        response.raise_for_status()

        root = ET.fromstring(response.text)
        channel = root.find('channel')
        if channel is None:
            return []

        parsed: List[Dict[str, str]] = []
        for item in channel.findall('item'):
            raw_title = item.findtext('title', default='')
            raw_url = item.findtext('link', default='')
            raw_snippet = item.findtext('description', default='')

            title = self._clean_text(raw_title)
            url = html.unescape(raw_url)
            snippet = self._clean_text(raw_snippet)

            if title and url:
                parsed.append({"title": title, "url": url, "snippet": snippet})

        return parsed

    def search(self, query: str, max_results: int = 5) -> List[Dict[str, str]]:
        """Realiza búsqueda web y retorna lista de resultados"""
        query = query.strip()
        if not query:
            return []

        launch_intent = self._is_launch_intent(query)
        focus_terms = self._extract_focus_terms(query)
        query_candidates = self._build_queries(query)

        merged_by_url: Dict[str, Dict[str, str]] = {}
        for candidate in query_candidates:
            for item in self._fetch_rss(candidate):
                domain = self._domain(item["url"])
                if self._is_blocked(domain):
                    continue

                score = self._score_result(item, focus_terms, launch_intent)
                item_with_score = {
                    "title": item["title"],
                    "url": item["url"],
                    "snippet": item["snippet"],
                    "_score": score,
                }

                previous = merged_by_url.get(item["url"])
                if not previous or score > previous["_score"]:
                    merged_by_url[item["url"]] = item_with_score

        ranked = sorted(merged_by_url.values(), key=lambda item: item["_score"], reverse=True)
        final = [
            {"title": item["title"], "url": item["url"], "snippet": item["snippet"]}
            for item in ranked[:max_results]
        ]

        return final
