<?php
/**
 * Clean-up markup for images that are inserted into post
 *
 * @package _s
 */


/**
 * Remove height and width attributes from images inserterd into content area
 */
function _s_remove_width_attribute( $html ) {
   $html = preg_replace( '/(width|height)="\d*"\s/', "", $html );
   return $html;
}
add_filter( 'post_thumbnail_html', '_s_remove_width_attribute', 10 );
add_filter( 'image_send_to_editor', '_s_remove_width_attribute', 10 );


/**
 * Remove p tags from around images inserterd into content area
 * wrap images in <figure> 
 */
function _s_img_unautop($pee) {
    $pee = preg_replace('/<p>\\s*?(<a .*?><img.*?><\\/a>|<img.*?>)?\\s*<\\/p>/s', '<figure>$1</figure>', $pee);
    return $pee;
}
add_filter( 'the_content', '_s_img_unautop', 30 );


// Remove width and height in editor, for a better responsive world.
if( ! function_exists( '_s_image_editor ' ) ) {
	function _s_image_editor($html, $id, $alt, $title) {
		return preg_replace(array(
				'/\s+width="\d+"/i',
				'/\s+height="\d+"/i',
				'/alt=""/i'
			),
			array(
				'',
				'',
				'',
				'alt="' . $title . '"'
			),
			$html);
	} /* end reverie_image_editor */
}