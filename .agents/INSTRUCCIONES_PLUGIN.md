# 📋 Instrucciones para Instalar el Plugin en WordPress

## Pasos para activar la funcionalidad de recuperación de contraseña

### Opción 1: Subir manualmente (Recomendado)

1. **Accede al panel de administración de WordPress**
   - Ve a https://koonetix.shop/wp-admin

2. **Sube el plugin**
   - En el menú lateral, ve a **Plugins → Añadir nuevo**
   - Haz clic en **Subir plugin**
   - Selecciona el archivo `wordpress-register-endpoint.php`
   - Haz clic en **Instalar ahora**

3. **Activa el plugin**
   - Una vez instalado, haz clic en **Activar plugin**

### Opción 2: Subir por FTP/SFTP

1. **Conecta por FTP** a tu servidor
2. **Navega** a la carpeta `/wp-content/plugins/`
3. **Crea** una carpeta llamada `custom-user-registration`
4. **Sube** el archivo `wordpress-register-endpoint.php` dentro de esa carpeta
5. **Activa** el plugin desde el panel de WordPress (Plugins → Plugins instalados)

### Opción 3: Usando el MCP de WordPress (desde aquí)

Si tienes configurado el MCP de WordPress, puedo subirlo directamente por ti.

---

## ✅ Verificar que funciona

1. **Abre** tu aplicación React en http://localhost:8080/login
2. **Haz clic** en "¿Olvidaste tu contraseña?"
3. **Ingresa** un email o usuario válido de tu WordPress
4. **Revisa** tu correo - deberías recibir un email con instrucciones

---

## 📧 Configuración de Email en WordPress

Para que los emails se envíen correctamente, asegúrate de que WordPress pueda enviar correos.

Si los emails no llegan, puedes instalar un plugin SMTP como:
- **WP Mail SMTP** (recomendado)
- **Easy WP SMTP**

Esto mejorará la entregabilidad de los correos.

---

## 🔒 Seguridad

El plugin ya incluye:
- ✅ Sanitización de inputs
- ✅ Validación de usuarios
- ✅ Generación de claves seguras
- ✅ Enlaces temporales de recuperación
- ✅ Permisos REST API configurados

---

## 🎨 Personalización del Email (Opcional)

Si quieres personalizar el email que se envía, edita las líneas 173-182 del archivo:

```php
$subject = 'Recuperación de contraseña - Koonetix';

$message = "Hola,\n\n";
$message .= "Has solicitado restablecer tu contraseña...";
// ... más contenido
```

Puedes hacerlo más visual usando HTML:

```php
$headers = array('Content-Type: text/html; charset=UTF-8');

$message = "
<html>
<body style='font-family: Arial, sans-serif;'>
    <h2>Recuperación de contraseña</h2>
    <p>Hola <strong>{$user_login}</strong>,</p>
    <p>Has solicitado restablecer tu contraseña.</p>
    <p><a href='{$reset_link}' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Restablecer contraseña</a></p>
</body>
</html>
";
```
