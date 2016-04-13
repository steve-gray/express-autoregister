'use strict';
const debug = require('debug')('express-autoregister');
const express = require('express');
const fs = require('fs');
const leftPad = require('left-pad');
const path = require('path');
const util = require('util');

/**
 * Walk the directories, discovering files that can be used.
 *
 * @param {object} config               - Configuration for directory walker.
 * @param {Router} parentRouter         - Express JS router for root/parent directory
 * @param {String} directoryPath        - Current directory path for this directory.
 * @param {Number} depth                - Nesting depth
 * @returns {Router}                    - Express JS directory.
 */
function walkDirectory(config, parentRouter, directoryPath, depth) {
  const directoryName = path.basename(directoryPath);
  const routerPath = util.format('/%s', parentRouter ? directoryName : '');
  const router = express.Router('/');
  const padding = leftPad('', depth * 3);
  debug('%sStarting directory %s', padding, directoryPath);
  if (parentRouter) {
    debug('%sRouter is a child of a parent, attaching under path: %s', padding, routerPath);
    parentRouter.use(routerPath, router);
  } else {
    debug('%sRouter is the root, no parent-attach.', padding);
  }

  // Recurse the child paths
  const children = fs.readdirSync(directoryPath);
  for (const child of children) {
    const childPath = path.join(directoryPath, child);
    const stat = fs.lstatSync(childPath);

    // Recursively build paths
    if (stat.isDirectory()) {
      debug('%sRecursing child: %s', padding, child);
      walkDirectory(config, router, childPath, depth + 1);
    } else if (path.extname(childPath) == (config.extension || '.js')) {
      debug('%sLoading JS module via require(%s)', padding, childPath);
      const subRouter = require(childPath);
      debug('%sAppending route to hierarchy', padding);
      router.use(subRouter);
    }
  }

  debug('%sFinished directory %s', padding, directoryPath);
  return router;
}

/**
 * Perform automatic route registration for the application from the specified route root
 * directory.
 *
 * @param {object} config           - Route mapping configuration.
 * @returns {Router}                - Express router.
 */
function autoRegisterRoutes(config) {
  if (!config) {
    throw new Error('Unable to register routes: config parameter not specified.');
  }

  // Read the root directory
  debug('Starting automatic route registration');
  const hierarchy = walkDirectory(config, null, config.routes, 1);
  debug('Route mapping completed');
  return hierarchy;
}

module.exports = autoRegisterRoutes;
