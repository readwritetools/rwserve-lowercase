//=============================================================================
//
// File:         rwserve-lowercase/src/index.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2018
// License:      MIT License
// Initial date: Aug 10, 2018
//
// Contents:     An RWSERVE plugin to handle static filenames that have been
//               converted from mixed case to all lowercase.
//
//               If the requested file exists, return immediately and allow
//               standard processing to resume.
//               If the requested file does not exist, apply a lowercase filter
//               to the entire path and try again.
//               If the lowercase version exists, inform the user-agent with
//               a 'location' header and a status code of FOUND_302.
//               If the lowercase version does not exist return NOT_FOUND_404.
//
//======================== Sample configuration ===============================
/*
	plugins {
		rwserve-lowercase {
			location `/srv/rwserve-plugins/node_modules/rwserve-lowercase/dist/index.js`
		}
		router {
			`*`  *methods=GET,HEAD  *plugin=rwserve-lowercase
		}	
	}
*/
//=============================================================================

import {log} 		from 'rwserve-plugin-sdk';
import {SC} 		from 'rwserve-plugin-sdk';
import fs			from 'fs';
import path			from 'path';

export default class RwserveLowercase {

	constructor(hostConfig) {
		this.hostConfig = hostConfig;
    	Object.seal(this);
	}
	
	async startup() {
		log.debug('RwserveLowercase', `version ${this.hostConfig.pluginsConfig.rwserveLowercase.pluginVersion}; © 2018 Read Write Tools; MIT License`); 
	}
	
	async shutdown() {
		log.debug('RwserveLowercase', `Shutting down ${this.hostConfig.hostname}`); 
	}
	
	//^ Processing sequence for handling this plugin
	async processingSequence(workOrder) {

		// This plugin is only meaningful for GET and HEAD
		if (workOrder.getMethod() != 'GET' && workOrder.getMethod() != 'HEAD')
			return;
		
		try {
			var mixedResourcePath = workOrder.getResourcePath();
			var absoluteResourcePath = path.join(this.hostConfig.documentRoot, mixedResourcePath);
			
			// if the file exists, return immediately and allow standard processing to occur
			if (fs.existsSync(absoluteResourcePath))
				return;
			
			var lcResourcePath = mixedResourcePath.toLowerCase();
			var absoluteLcResourcePath = path.join(this.hostConfig.documentRoot, lcResourcePath);

			if (fs.existsSync(absoluteLcResourcePath)) {
				// if a lowercase version of the file exists, inform the user-agent with a 'location' header and a status of FOUND_302
				var hostname = this.hostConfig.hostname;
				var port = ':' + this.hostConfig.serverConfig.port;
				if (port == ':443')
					port = '';
					
				var location = `https://${hostname}${port}${lcResourcePath}`;
				workOrder.addStdHeader('location', location);
				workOrder.setEmptyResponseBody();
				workOrder.setStatusCode(SC.FOUND_302);
			}
			else {
				// neither the original nor the lowercase version exists, return NOT_FOUND_404
				workOrder.setEmptyResponseBody();
				workOrder.setStatusCode(SC.NOT_FOUND_404);				
			}			
		}
		catch (err) {
			// send the error message to the journald log
			log.error(err.message);
		}
	}
}
