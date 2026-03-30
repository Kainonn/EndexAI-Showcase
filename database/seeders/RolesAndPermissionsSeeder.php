<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Seed roles and permissions for Orion.
     */
    public function run(): void
    {
        $permissions = [
            'orion.chat.use',
            'orion.chat.history.view',
            'orion.clients.manage',
            'orion.users.manage',
            'orion.roles.manage',
            'orion.analytics.view',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $admin = Role::findOrCreate('admin', 'web');
        $equipo = Role::findOrCreate('equipo', 'web');
        $cliente = Role::findOrCreate('cliente', 'web');

        $admin->syncPermissions($permissions);
        $equipo->syncPermissions([
            'orion.chat.use',
            'orion.chat.history.view',
            'orion.clients.manage',
            'orion.analytics.view',
        ]);
        $cliente->syncPermissions([
            'orion.chat.use',
            'orion.chat.history.view',
        ]);
    }
}
