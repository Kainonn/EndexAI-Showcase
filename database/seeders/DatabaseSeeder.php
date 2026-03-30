<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@orion.local'],
            [
                'name' => 'Orion Admin',
                'password' => Hash::make('password'),
            ]
        );

        $adminUser->assignRole('admin');
    }
}
