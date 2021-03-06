// Copyright (c) 2017 Intel Corporation. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require('assert');
const path = require('path');
const childProcess = require('child_process');
const rclnodejs = require('../index.js');
const utils = require('./utils.js');

describe('Cross-language interaction', function() {
  this.timeout(60 * 1000);

  before(function() {
    return rclnodejs.init();
  });

  after(function() {
    rclnodejs.shutdown();
  });

  describe('Node.js Subcription', function() {
    it('Node.js subscription should receive msg from C++ publisher', (done) => {
      var node = rclnodejs.createNode('cpp_pub_js_sub');
      const rclString = rclnodejs.require('std_msgs').msg.String;
      var destroy = false;
      var cppTalkPath = path.join(process.env['AMENT_PREFIX_PATH'], 'lib', 'demo_nodes_cpp', 'talker');
      var cppTalker = childProcess.spawn(cppTalkPath);
      var subscription = node.createSubscription(rclString, 'chatter', (msg) => {
        assert.ok(/Hello World:/.test(msg.data));
        if (!destroy) {
          node.destroy();
          cppTalker.kill('SIGINT');
          destroy = true;
          done();
        }
      });
      rclnodejs.spin(node);
    });

    it('Node.js subscription should receive msg from Python publisher', (done) => {
      var node = rclnodejs.createNode('cpp_pub_py_sub');
      const rclString = rclnodejs.require('std_msgs').msg.String;
      var destroy = false;
      var pyTalker = utils.launchPythonProcess([`${__dirname}/py/talker.py`]);
      var subscription = node.createSubscription(rclString, 'py_js_chatter', (msg) => {
        assert.ok(/Hello World/.test(msg.data));
        if (!destroy) {
          node.destroy();
          pyTalker.kill('SIGINT');
          destroy = true;
          done();
        }
      });
      rclnodejs.spin(node);
    });
  });
    
  describe('Node.js publisher', function() {
    it('Cpp subscription should receive msg from Node.js publisher', (done) => {
      var node = rclnodejs.createNode('js_pub_cpp_sub');
      const rclString = rclnodejs.require('std_msgs').msg.String;
      var destroy = false;

      let text = 'Greeting from Node.js publisher';
      let cppListenerPath = path.join(process.env['AMENT_PREFIX_PATH'], 'lib', 'demo_nodes_cpp', 'listener');
      var cppListener = childProcess.spawn(cppListenerPath);
      var publisher = node.createPublisher(rclString, 'chatter');
      var msg = new rclString();
      msg.data = text;
      var timer = setInterval(() => {
        publisher.publish(msg);
      }, 100);

      cppListener.stdout.on('data', (data) => {
        if (!destroy) {
          assert.ok(new RegExp(text).test(data.toString()));
          clearInterval(timer);
          node.destroy();
          cppListener.kill('SIGINT');
          destroy = true;
          done();
        }
      });
      rclnodejs.spin(node);
    });

    it('Python subscription should receive msg from Node.js publisher', function(done) {
      var node = rclnodejs.createNode('js_pub_py_sub');
      const rclString = rclnodejs.require('std_msgs').msg.String;
      var destroy = false;

      let text = 'Greeting from Node.js publisher to Python subscription';
      var pyListener = utils.launchPythonProcess([`${__dirname}/py/listener.py`]);
      var publisher = node.createPublisher(rclString, 'js_py_chatter');
      var msg = new rclString();
      msg.data = text;

      var timer = setInterval(() => {
        publisher.publish(msg);
      }, 100);
      pyListener.stdout.on('data', (data) => {
        if (!destroy) {
          assert.ok(new RegExp(text).test(data.toString()));
          clearInterval(timer);
          node.destroy();
          pyListener.kill('SIGINT');
          destroy = true;
          done();
        }
      });
      rclnodejs.spin(node);
    });
  });

  describe('Node.js client', function() {
    it('Node.js client should work with Python service', function(done) {
      var node = rclnodejs.createNode('js_add_client');
      const AddTwoInts = rclnodejs.require('example_interfaces').srv.AddTwoInts;
      var destroy = false;

      var pyService = utils.launchPythonProcess([`${__dirname}/py/service.py`]);
      var client = node.createClient(AddTwoInts, 'py_js_add_service');
      let request = new AddTwoInts.Request();
      request.a = 1;
      request.b = 2;

      var timer = setInterval(() => {
        client.sendRequest(request, (response) => {
          if (!destroy) {
            assert.deepStrictEqual(response.sum, 3);
            clearInterval(timer);
            node.destroy();
            pyService.kill('SIGINT');
            destroy = true;
            done();
          }      
        });
      }, 100);

      rclnodejs.spin(node);
    });
  });
  
  describe('Node.js service', function() {
    it('Node.js service should work with Python client', function(done) {
      var node = rclnodejs.createNode('js_add_service');
      const AddTwoInts = rclnodejs.require('example_interfaces').srv.AddTwoInts;
      var destroy = false;

      var service = node.createService(AddTwoInts, 'js_py_add_service', (request, response) => {
        assert.deepStrictEqual(typeof request.a, 'number');
        assert.deepStrictEqual(typeof request.b, 'number');
        response.sum = request.a + request.b;
        return response;
      });
      rclnodejs.spin(node);

      var pyClient = utils.launchPythonProcess([`${__dirname}/py/client.py`]);
      pyClient.stdout.on('data', function(data) {
        assert.deepEqual(parseInt(data, 10), 3);
        if (!destroy) {
          node.destroy();
          destroy = true;
          done();
        }
      });
    });
  });
});
