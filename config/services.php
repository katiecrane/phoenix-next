<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'analytics' => [
        'google_id' => env('GOOGLE_ANALYTICS_ID'),
        'keen_id' => env('KEEN_PROJECT_ID'),
        'facebook_id' => env('FACEBOOK_APP_ID'),
    ],

    'gladiator' => [
        'url' => env('GLADIATOR_URL', 'https://gladiator-qa.dosomething.org'),
        'key' => env('GLADIATOR_API_KEY'),
    ],

    'northstar' => [
        'grant' => 'authorization_code', // Default OAuth grant to use: either 'authorization_code' or 'client_credentials'
        'url' => env('NORTHSTAR_URL'),

        'authorization_code' => [
            'client_id' => env('NORTHSTAR_AUTHORIZATION_ID'),
            'client_secret' => env('NORTHSTAR_AUTHORIZATION_SECRET'),
            'scope' => ['user', 'openid', 'role:staff', 'role:admin'],
            'redirect_uri' => 'next/login',
        ],
    ],

    'phoenix-legacy' => [
        'url' => env('PHOENIX_LEGACY_URL', 'https://staging.dosomething.org'),
        'username' => env('PHOENIX_LEGACY_USERNAME'),
        'password' => env('PHOENIX_LEGACY_PASSWORD'),
    ],

    'sixpack' => [
        'url' => env('SIXPACK_BASE_URL'),
        'prefix' => env('SIXPACK_COOKIE_PREFIX'),
        'timeout' => env('SIXPACK_TIMEOUT'),
    ],
];
