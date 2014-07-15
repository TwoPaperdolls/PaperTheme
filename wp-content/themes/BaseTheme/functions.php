<?php
/**
 * _s functions and definitions
 *
 * @package _s
 */

if ( ! function_exists( '_s_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function _s_setup() {

	// launching operation cleanup
	 add_action('init', '_s_head_cleanup');

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', '_s' ),
	) );
	
	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
	) );

	
}
endif; // _s_setup
add_action( 'after_setup_theme', '_s_setup' );

/**
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function _s_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', '_s' ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h1 class="widget-title">',
		'after_title'   => '</h1>',
	) );
}
add_action( 'widgets_init', '_s_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function _s_scripts() {
	global $wp_styles; // call global $wp_styles variable to add conditional wrapper around ie stylesheet the WordPress way

  if (!is_admin()) {

		// modernizr (without media query polyfill)
		wp_register_script( '_s_modernizr', get_stylesheet_directory_uri() . '/js/libs/modernizr.custom.js', array(), '2.5.3', false );

		// register main stylesheet from css
		wp_register_style( '_s_stylesheet', get_stylesheet_directory_uri() . '/css/style.css', array(), '', 'all' );

		// ie-only style sheet
		wp_register_style( '_s_ie-only', get_stylesheet_directory_uri() . '/css/ie.css', array(), '' );

		//adding scripts file in the footer
		wp_register_script( '_s_custom-js', get_stylesheet_directory_uri() . '/js/_s_js.js', array( 'jquery' ), '', true );

		// enqueue styles and scripts
		wp_enqueue_script( '_s_modernizr' );
		wp_enqueue_style( '_s_stylesheet' );
		wp_enqueue_style( '_s_ie-only' );

		$wp_styles->add_data( '_s_ie-only', 'conditional', 'lt IE 9' ); // add conditional wrapper around ie stylesheet

		// enque JQuery from google CDN and add to footer 
		wp_deregister_script('jquery');
		wp_register_script('jquery', ("http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.js"), false, '1.11.1', true);
		wp_enqueue_script('jquery');
		

		// enqueue custom.js after Jquery in the footer
		wp_enqueue_script( '_s_custom-js' );

	}

	// wp_enqueue_style( '_s-style', get_stylesheet_uri() );
}
add_action( 'wp_enqueue_scripts', '_s_scripts' );

/**
 * Clean-up wp_head() garbage
 */
require get_template_directory() . '/inc/clean_wp_head.php';

/**
 * Clean images inserted into post
 */
require get_template_directory() . '/inc/cleanPostImgs.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

