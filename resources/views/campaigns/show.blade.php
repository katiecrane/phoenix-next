@extends('layouts.master')

@section('content')
    <header role="banner" class="header -hero" style="background-image: url('{{  get_image_url($campaign->coverImage, 'landscape') }}')">
        <div class="wrapper">
            <h1 class="header__title">{{ $campaign->title }}</h1>
            <p class="header__subtitle">{{ $campaign->callToAction }}</p>
        </div>
    </header>

    <div class="container">
        <div class="wrapper">
            @foreach ($campaign->activity_feed as $block)
                <div class="container__block {{ $block->displayOptions->map(function($c) { return '-'.$c; })->implode(' ') }}">
                    @includeIf('blocks.'.$block->type, ['block' => $block])
                </div>
            @endforeach
        </div>
    </div>

@endsection
