<?php
/**
 * Plugin Name: Custom User Registration
 * Plugin URI: https://koonetix.shop
 * Description: Endpoint personalizado para registro de usuarios desde la aplicación React
 * Version: 1.0.0
 * Author: Koonetix
 * Author URI: https://koonetix.shop
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API endpoint for user registration
 */
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true', // Allow public access
    ));
});

/**
 * Handle user registration
 */
function custom_user_registration($request)
{
    $username = sanitize_text_field($request->get_param('username'));
    $email = sanitize_email($request->get_param('email'));
    $password = $request->get_param('password');
    $first_name = sanitize_text_field($request->get_param('first_name'));
    $last_name = sanitize_text_field($request->get_param('last_name'));

    // Validate required fields
    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error(
            'missing_fields',
            'Por favor completa todos los campos requeridos.',
            array('status' => 400)
        );
    }

    // Validate email
    if (!is_email($email)) {
        return new WP_Error(
            'invalid_email',
            'El email proporcionado no es válido.',
            array('status' => 400)
        );
    }

    // Check if username already exists
    if (username_exists($username)) {
        return new WP_Error(
            'username_exists',
            'Este nombre de usuario ya está en uso.',
            array('status' => 400)
        );
    }

    // Check if email already exists
    if (email_exists($email)) {
        return new WP_Error(
            'email_exists',
            'Este email ya está registrado.',
            array('status' => 400)
        );
    }

    // Validate password strength (minimum 8 characters)
    if (strlen($password) < 8) {
        return new WP_Error(
            'weak_password',
            'La contraseña debe tener al menos 8 caracteres.',
            array('status' => 400)
        );
    }

    // Create the user
    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        return new WP_Error(
            'registration_failed',
            $user_id->get_error_message(),
            array('status' => 500)
        );
    }

    // Update user meta with first and last name
    if (!empty($first_name)) {
        update_user_meta($user_id, 'first_name', $first_name);
    }
    if (!empty($last_name)) {
        update_user_meta($user_id, 'last_name', $last_name);
    }

    // Set user role to customer (for WooCommerce)
    $user = new WP_User($user_id);
    $user->set_role('customer');

    // Optional: Send welcome email
    wp_new_user_notification($user_id, null, 'user');

    return array(
        'success' => true,
        'message' => '¡Cuenta creada con éxito!',
        'user_id' => $user_id,
        'username' => $username,
        'email' => $email
    );
}
