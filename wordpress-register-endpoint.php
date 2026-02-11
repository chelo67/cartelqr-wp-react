<?php
/**
 * Plugin Name: Custom User Registration & Password Reset
 * Plugin URI: https://koonetix.shop
 * Description: Endpoints personalizados para registro de usuarios y recuperación de contraseña
 * Version: 1.1.0
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
 * Register custom REST API endpoints
 */
add_action('rest_api_init', function () {
    // Registration endpoint
    register_rest_route('custom/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true',
    ));

    // Password reset request endpoint
    register_rest_route('custom/v1', '/reset-password', array(
        'methods' => 'POST',
        'callback' => 'custom_password_reset_request',
        'permission_callback' => '__return_true',
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

/**
 * Handle password reset request
 */
function custom_password_reset_request($request)
{
    $user_login = sanitize_text_field($request->get_param('user_login'));

    if (empty($user_login)) {
        return new WP_Error(
            'missing_field',
            'Por favor ingresa tu email o nombre de usuario.',
            array('status' => 400)
        );
    }

    // Try to get user by email or username
    if (is_email($user_login)) {
        $user = get_user_by('email', $user_login);
    } else {
        $user = get_user_by('login', $user_login);
    }

    if (!$user) {
        return new WP_Error(
            'user_not_found',
            'No se encontró ningún usuario con ese email o nombre de usuario.',
            array('status' => 404)
        );
    }

    // Generate password reset key
    $reset_key = get_password_reset_key($user);

    if (is_wp_error($reset_key)) {
        return new WP_Error(
            'reset_key_failed',
            'No se pudo generar el enlace de recuperación.',
            array('status' => 500)
        );
    }

    // Send password reset email
    $user_email = $user->user_email;
    $user_login = $user->user_login;

    $subject = 'Recuperación de contraseña - Koonetix';

    $message = "Hola,\n\n";
    $message .= "Has solicitado restablecer tu contraseña para tu cuenta en Koonetix.\n\n";
    $message .= "Nombre de usuario: " . $user_login . "\n\n";
    $message .= "Para restablecer tu contraseña, visita el siguiente enlace:\n\n";
    $message .= network_site_url("wp-login.php?action=rp&key=$reset_key&login=" . rawurlencode($user_login), 'login') . "\n\n";
    $message .= "Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá sin cambios.\n\n";
    $message .= "Saludos,\n";
    $message .= "El equipo de Koonetix";

    $headers = array('Content-Type: text/plain; charset=UTF-8');

    $sent = wp_mail($user_email, $subject, $message, $headers);

    if (!$sent) {
        return new WP_Error(
            'email_failed',
            'No se pudo enviar el correo de recuperación.',
            array('status' => 500)
        );
    }

    return array(
        'success' => true,
        'message' => 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.'
    );
}
