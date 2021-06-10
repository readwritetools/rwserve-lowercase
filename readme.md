












<figure>
	<img src='/img/plugins/lowercase/lowercase-pixaby-andrea-schmidt.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Open Source RWSERVE plugin

# Lowercase

## Probe file system for lowercase filename


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2018-10-22>Oct 22, 2018</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The incoming request path is examined for uppercase letters and the file system is probed with its equivalent lowercase name. If the equivalent filename exists, return with a status code of <code>302 Found</code> and a <code>location</code> header, instructing the browser to reissue the request.</td></tr>
</table>

### Motivation

Filenames on Windows are case insensitive, so a request for `Hello-World.html` and
`hello-world.html` are equivalent. Not so on Linux. These are recognized as two
distinct files. Neither way is "right", but moving from one file system to
another with names like this is problematic.

Because of this, it has become customary to restrict URL paths to be all
lowercase. Websites that started out on a case insensitive file system and were
later moved to a case-sensitive file system, may break when external hyperlinks
point to the incorrectly cased filename. One solution is to rename all filenames
to their lowercase equivalent, and use this plugin to instruct browsers of the
change.

The algorithm is straightforward:

   1. Check the file system to see if the requested resource path exists; if so, skip
      the remaining steps and resume standard processing.
   2. Apply a lowercase filter to the full resource path and filename.
   3. Probe the file system to see if the lowercased version exists:

      * If so, return with `302 Found` and a `location` header containing the correct
         resource path.
      * If not, return with `404 Not Found`.

#### Customization

This plugin is open source and can be modified or enhanced to perform tasks such
as these:

   * Safely reorganize the directory structure of your website, without unnecessarily
      breaking external links.
   * Define a lookup table with *original* filenames and *archived* filenames, where
      access to archived content is behind a paywall.

### Download

The plugin module is available from <a href='https://www.npmjs.com/package/rwserve-lowercase'>NPM</a>
. Before proceeding, you should already have `Node.js` and `RWSERVE` configured and
tested.

This module should be installed on your web server in a well-defined place, so
that it can be discovered by `RWSERVE`. The standard place for public domain
plugins is `/srv/rwserve-plugins`.

<pre>
cd /srv/rwserve-plugins
npm install rwserve-lowercase
</pre>

### Configuration is Everything

Make the software available by declaring it in the `plugins` section of your
configuration file. For detailed instructions on how to do this, refer to the <a href='https://rwserve.readwritetools.com/plugins.blue'>plugins</a>
documentation on the `Read Write Tools HTTP/2 Server` website.

#### TL;DR

<pre>
plugins {
    rwserve-lowercase {
        location `/srv/rwserve-plugins/node_modules/rwserve-lowercase/dist/index.js`
    }
    router {
        `*`  *methods=GET,HEAD  *plugin=rwserve-lowercase
    }    
}
</pre>

The sample `router` shown above will route all requests (```*```) for `GET` or `HEAD` methods,
to the plugin.

#### Cookbook

A full configuration file with typical settings for a server running on
localhost port 7443, is included in this NPM module at `etc/lowercase-config`. To
use this configuration file, adjust these variables if they don't match your
server setup:

<pre>
$PLUGIN-PATH='/srv/rwserve-plugins/node_modules/rwserve-lowercase/dist/index.js'
$PRIVATE-KEY='/etc/pki/tls/private/localhost.key'
$CERTIFICATE='/etc/pki/tls/certs/localhost.crt'
$DOCUMENTS-PATH='/srv/rwserve/configuration-docs'
</pre>

#### Deployment

Once you've tested the plugin and are ready to go live, adjust your production
web server's configuration in `/etc/rwserve/rwserve.conf` and restart it using `systemd`
. . .

<pre>
[user@host ~]# systemctl restart rwserve
</pre>

. . . then monitor its request/response activity with `journald`.

<pre>
[user@host ~]# journalctl -u rwserve -ef
</pre>

### Prerequisites

This is a plugin for the **Read Write Tools HTTP/2 Server**, which works on Linux
platforms.


<table>
	<tr><th>Software</th> <th>Minimum Version</th> <th>Most Recent Version</th></tr>
	<tr><td>Ubuntu</td> 		<td>16 Xenial Xerus</td> <td>16 Xenial Xerus</td></tr>
	<tr><td>Debian</td> 		<td>9 Stretch</td> 		<td>10 Buster</td></tr>
	<tr><td>openSUSE</td>	<td>openSUSE 15.1</td> 	<td>openSUSE 15.1</td></tr>
	<tr><td>Fedora</td> 		<td>Fedora 27</td> 		<td>Fedora 32</td></tr>
	<tr><td>CentOS</td>		<td>CentOS 7.4</td>		<td>CentOS 8.1</td></tr>
	<tr><td>RHEL</td> 		<td>RHEL 7.8</td>		<td>RHEL 8.2</td></tr>
	<tr><td>RWSERVE</td>		<td>RWSERVE 1.0.1</td>	<td>RWSERVE 1.0.47</td></tr>
	<tr><td>Node.js</td>		<td>Node.js 10.3</td>	<td>Node.js 12.17</td></tr>
</table>

### Review


<table>
	<tr><th>Lessons</th></tr>
	<tr><td>This plugin demonstrates a basic pattern that many plugins follow: <ul><li>Adding a standard response header using <code>addStdHeader()</code> </li> <li>Setting an "empty" response body with <code>setEmptyPayload()</code> </li> <li>Setting the response status code with <code>setStatusCode()</code> </li> </ul> Find other plugins for the <code>Read Write Tools HTTP/2 Server</code> using <a href='https://www.npmjs.com/search?q=keywords:rwserve'>npm</a> with these keywords: <kbd>rwserve</kbd>, <kbd>http2</kbd>, <kbd>plugins</kbd>. </td></tr>
</table>

### License

The <span>rwserve-lowercase</span> plugin is licensed under the MIT
License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

### Availability


<table>
	<tr><td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwserve-lowercase'>github</a></td></tr>
	<tr><td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwserve-lowercase'>NPM</a></td></tr>
	<tr><td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/plugins/lowercase.blue'>Read Write Hub</a></td></tr>
</table>

