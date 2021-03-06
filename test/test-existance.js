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
const rclnodejs = require('../index.js');
const assertUtils = require('./utils.js');
const assertMember = assertUtils.assertMember;
const assertThrowsError = assertUtils.assertThrowsError;

describe('rclnodejs module existance testing', function() {
  describe('rclnodejs module members', function() {
    it('createNode method should exist', function() {
      assertMember('createNode', rclnodejs, rclnodejs.createNode, 'function');
    });

    it('init method should exist', function() {
      assertMember('init', rclnodejs, rclnodejs.init, 'function');
    });

    it('regenerateAll method should exist', function() {
      assertMember('regenerateAll', rclnodejs, rclnodejs.regenerateAll, 'function');
    });

    it('require method should exist', function() {
      assertMember('require', rclnodejs, rclnodejs.require, 'function');
    });    

    it('shutdown method should exist', function() {
      assertMember('shutdown', rclnodejs, rclnodejs.shutdown, 'function');
    });    

    it('spin method should exist', function() {
      assertMember('shutdown', rclnodejs, rclnodejs.shutdown, 'function');
    });    
  });
});

describe('rclnodejs class existance testing', function() {
  this.timeout(60 * 1000);

  before(function() {
    return rclnodejs.init();
  });

  after(function() {
    rclnodejs.shutdown();
  });

  describe('Client class', function() {
    var node, GetParameters, client;

    before(function() {
      node = rclnodejs.createNode('Client');
      GetParameters = rclnodejs.require('rcl_interfaces').srv.GetParameters;
      client = node.createClient(GetParameters, 'get/parameters');
    });

    after(function() {
      node.destroy();
    });

    it('sequenceNumber property should exist', function() {
      assertMember('sequenceNumber', client, client.sequenceNumber, 'number');
    });

    it('sendRequest method should exist', function() {
      assertMember('sendRequest', client, client.sendRequest, 'function');
    });
  });

  describe('Node class', function() {
    var node;

    before(function() {
      node = rclnodejs.createNode('Node');
    });

    after(function() {
      node.destroy();
    });
    
    it('createClient method should exist', function() {
      assertMember('createClient', node, node.createClient, 'function');
    });

    it('createPublisher method should exist', function() {
      assertMember('createPublisher', node, node.createPublisher, 'function');
    });

    it('createService method should exist', function() {
      assertMember('createService', node, node.createService, 'function');
    });

    it('createSubscription method should exist', function() {
      assertMember('createSubscription', node, node.createSubscription, 'function');
    });

    it('createTimer method should exist', function() {
      assertMember('createTimer', node, node.createTimer, 'function');
    });

    it('destroy method should exist', function() {
      assertMember('destroy', node, node.destroy, 'function');
    });    
  });

  describe('Publisher class', function() {
    var node, rclString, publisher;

    before(function() {
      node = rclnodejs.createNode('Publisher');
      rclString = rclnodejs.require('std_msgs').msg.String;
      publisher = node.createPublisher(rclString, 'chatter');
    });

    after(function() {
      node.destroy();
    });

    it('topic property should exist', function() {
      assertMember('topic', publisher, publisher.topic, 'string');
    });

    it('publish method should exist', function() {
      assertMember('publish', publisher, publisher.publish, 'function');
    });
  });

  describe('Timer class', function() {
    var node, timer;

    before(function() {
      node = rclnodejs.createNode('Timer');
      timer = node.createTimer(10, () => {});
    });

    after(function() {
      timer.cancel();
      node.destroy();
    });

    it('period property should exist', function() {
      assertMember('period', timer, timer.period, 'number');
      assert.deepStrictEqual(timer.period, 10);
    });

    it('cancel method should exist', function() {
      assertMember('cancel', timer, timer.cancel, 'function');
    });

    it('isCanceled method should exist', function() {
      assertMember('isCanceled', timer, timer.isCanceled, 'function');
    });

    it('isReady method should exist', function() {
      assertMember('isReady', timer, timer.isReady, 'function');
    });

    it('reset method should exist', function() {
      assertMember('reset', timer, timer.reset, 'function');
    });
    
    it('timeSinceLastCall method should exist', function() {
      assertMember('timeSinceLastCall', timer, timer.timeSinceLastCall, 'function');
    });    

    it('timeUntilNextCall method should exist', function() {
      assertMember('timeUntilNextCall', timer, timer.timeUntilNextCall, 'function');
    });
  });

  describe('QoS class', function() {
    var qos;

    before(function() {
      qos = new rclnodejs.QoS();
    });

    it('should have getter avoidRosNameSpaceConventions', function() {
      assertMember('avoidRosNameSpaceConventions', qos, qos.avoidRosNameSpaceConventions, 'boolean');
    });

    it('should have getter depth', function() {
      assertMember('depth', qos, qos.depth, 'number');
    });

    it('should have getter durability', function() {
      assertMember('durability', qos, qos.durability, 'number');
    });

    it('should have static getter DurabilityPolicy', function() {
      assertMember('DurabilityPolicy', rclnodejs.QoS,
        rclnodejs.QoS.DurabilityPolicy, 'object');
    });

    it('should have getter history', function() {
      assertMember('history', qos, qos.history, 'number');
    });

    it('should have static getter HistoryPolicy', function() {
      assertMember('HistoryPolicy', rclnodejs.QoS, rclnodejs.QoS.HistoryPolicy, 'object');
    });

    it('should have static getter profileDefault', function() {
      assertMember('profileDefault', rclnodejs.QoS, rclnodejs.QoS.profileDefault, 'string');
    });

    it('should have static getter profileParameterEvents', function() {
      assertMember('profileParameterEvents', rclnodejs.QoS, rclnodejs.QoS.profileParameterEvents, 'string');
    });

    it('should have static getter profileParameters', function() {
      assertMember('profileParameters', rclnodejs.QoS, rclnodejs.QoS.profileParameters, 'string');
    });

    it('should have static getter profileSensorData', function() {
      assertMember('profileSensorData', rclnodejs.QoS, rclnodejs.QoS.profileSensorData, 'string');
    });

    it('should have static getter profileServicesDefault', function() {
      assertMember('profileServicesDefault', rclnodejs.QoS, rclnodejs.QoS.profileServicesDefault, 'string');
    });

    it('should have static getter profileSystemDefault', function() {
      assertMember('profileSystemDefault', rclnodejs.QoS, rclnodejs.QoS.profileSystemDefault, 'string');
    });

    it('should have getter reliability', function() {
      assertMember('reliability', qos, qos.reliability, 'number');
    });

    it('should have static getter ReliabilityPolicy', function() {
      assertMember('ReliabilityPolicy', rclnodejs.QoS, rclnodejs.QoS.ReliabilityPolicy, 'object');
    });

    it('should have setter avoidRosNameSpaceConventions', function() {
      qos.avoidRosNameSpaceConventions = true;
      assert.ok(qos.avoidRosNameSpaceConventions);

      assertThrowsError(() => {
        qos.avoidRosNameSpaceConventions = 1;
      }, TypeError, 'Invalid argument', 'Failed to call setter');
    });

    it('should have setter depth', function() {
      qos.depth = 0;
      assert.deepStrictEqual(qos.depth, 0);

      assertThrowsError(() => {
        qos.depth = 'abc';
      }, TypeError, 'Invalid argument', 'Failed to call setter');
    });

    it('should have setter durability', function() {
      qos.durability = 0;
      assert.deepStrictEqual(qos.durability, 0);

      assertThrowsError(() => {
        qos.durability = 'abc';
      }, TypeError, 'Invalid argument', 'Failed to call setter');
    });

    it('should have setter history', function() {
      qos.history = 0;
      assert.deepStrictEqual(qos.history, 0);

      assertThrowsError(() => {
        qos.history = 'abc';
      }, TypeError, 'Invalid argument', 'Failed to call setter');
    });

    it('should have setter reliability', function() {
      qos.reliability = 0;
      assert.deepStrictEqual(qos.reliability, 0);

      assertThrowsError(() => {
        qos.reliability = 'abc';
      }, TypeError, 'Invalid argument', 'Failed to call setter');
    });
  });
});
