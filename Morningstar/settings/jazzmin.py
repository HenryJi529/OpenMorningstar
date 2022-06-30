# https://github.com/farridav/django-jazzmin
# https://django-jazzmin.readthedocs.io/configuration/
JAZZMIN_UI_TWEAKS = {
    "sidebar_nav_child_indent": True,
    "sidebar_fixed": True
}

JAZZMIN_SETTINGS = {
    # title of the window (Will default to current_admin_site.site_title if absent or None)
    "site_title": "Morningstar Admin",

    # Title on the login screen (19 chars max) (defaults to current_admin_site.site_header if absent or None)
    "site_header": "晨星后台",

    # Logo to use for your site, must be present in static files, used for brand on top left
    "site_logo": "base/img/logo_admin.png",

    # CSS classes that are applied to the logo above
    "site_logo_classes": "img-circle",

    # Relative path to a favicon for your site, will default to site_logo if absent (ideally 32x32 px)
    "site_icon": "base/img/favicon.ico",

    # Welcome text on the login screen
    "welcome_sign": "欢迎登录～",

    # Copyright on the footer
    "copyright": "Henry Ji",

    # The model admin to search from the search bar, search bar omitted if excluded
    "search_model": "Morningstar.User",

    # Field name on user model that contains avatar ImageField/URLField/Charfield or a callable that receives the user
    "user_avatar": "avatar",
    ############
    # Top Menu #
    ############
    # Links to put along the top menu
    "topmenu_links": [

        # Url that gets reversed (Permissions can be added)
        {"name": "主页",  "url": "admin:index",
            "permissions": ["auth.view_user"]},
        # external url that opens in a new window (Permissions can be added)
        {"name": "支持", "url": "https://github.com/HenryJi529/OpenMorningstar/issues",
            "new_window": True},
        {"name": "休闲", "url": "https://web.sanguosha.com/",
            "new_window": True},


        # model admin to link to (Permissions checked against model)
        {"model": "Morningstar.User"},

        # App with dropdown menu to all its models pages (Permissions checked against models)
        {"app": "blog"},
        {"app": "joke"},
        {"app": "poll"},

    ],

    #############
    # User Menu #
    #############

    # Additional links to include in the user menu on the top right ("app" url type is not allowed)
    "usermenu_links": [
        {"name": "反馈", "url": "https://github.com/HenryJi529/OpenMorningstar/issues",
            "new_window": True},
    ],

    #############
    # Side Menu #
    #############

    # Whether to display the side menu
    "show_sidebar": True,

    # Whether to aut expand the menu
    "navigation_expanded": False,

    # Hide these apps when generating side menu e.g (auth)
    # "hide_apps": ["auth"],

    # Hide these models when generating side menu (e.g Morningstar.user)
    "hide_models": [],

    # List of apps (and/or models) to base side menu ordering off of (does not need to contain all apps/models)
    "order_with_respect_to": ["Morningstar", "auth", "blog", "joke", "book", "poll",],

    # Custom links to append to app groups, keyed on app name
    "custom_links": {
        "blog": [{
            "name": "展示",
            "url": "https://morningstar529.com/",
            "icon": "fas fa-dragon"
        }]
    },

    # Custom icons for side menu apps/models See
    # https://fontawesome.com/v5/search?m=free&s=solid%2Cbrands
    # https://fontawesome.com/icons?d=gallery&m=free&v=5.0.0,5.0.1,5.0.10,5.0.11,5.0.12,5.0.13,5.0.2,5.0.3,5.0.4,5.0.5,5.0.6,5.0.7,5.0.8,5.0.9,5.1.0,5.1.1,5.2.0,5.3.0,5.3.1,5.4.0,5.4.1,5.4.2,5.13.0,5.12.0,5.11.2,5.11.1,5.10.0,5.9.0,5.8.2,5.8.1,5.7.2,5.7.1,5.7.0,5.6.3,5.5.0,5.4.2
    # for the full list of 5.13.0 free icon classes
    "icons": {
        "auth": "fas fa-users-cog", "auth.Group": "fas fa-users",
        "Morningstar": "fas fa-atom", "Morningstar.user": "far fa-id-card",
        "blog": "fab fa-blogger-b", "blog.category": "far fa-map", "blog.post": "far fa-file-word", "blog.tag": "fas fa-tag", "blog.comment": "far fa-comment-dots",
        "book": "fas fa-atlas", "book.book": "fas fa-book", "book.category": "fas fa-box", "book.author": "fas fa-copyright", "book.translator": "fas fa-language",
        "joke": "far fa-images", "joke.photo": "far fa-image", "joke.text": "fas fa-paragraph",
        "poll": "fas fa-poll", "poll.question": "fas fa-question", "poll.choice": "fas fa-arrow-circle-right",
    },
    # Icons that are used when one is not manually specified
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    #################
    # Related Modal #
    #################
    # Use modals instead of popups
    "related_modal_active": False,

    #############
    # UI Tweaks #
    #############
    # Relative paths to custom CSS/JS scripts (must be present in static files)
    "custom_css": "admin/css/custom.css",
    "custom_js": None,
    # Whether to show the UI customizer on the sidebar
    "show_ui_builder": True,

    ###############
    # Change view #
    ###############
    # Render out the change view as a single form, or in tabs, current options are
    # - single
    # - horizontal_tabs (default)
    # - vertical_tabs
    # - collapsible
    # - carousel
    "changeform_format": "horizontal_tabs",
    # override change forms on a per modeladmin basis
    "changeform_format_overrides": {"Morningstar.user": "collapsible", "auth.group": "vertical_tabs"},
    # Add a language dropdown into the admin
    # "language_chooser": True,

}
