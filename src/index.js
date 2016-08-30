var express = require('express');

var log4js = require('log4js');
log4js.configure('src/config/log.conf.json');

var logger = log4js.getLogger();
logger.debug('SharedServer start');