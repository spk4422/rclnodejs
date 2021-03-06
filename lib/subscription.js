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

const rclnodejs = require('bindings')('rclnodejs');
const Entity = require('./entity.js');

/**
 * @class - Class representing a Subscription in ROS
 * @hideconstructor
 */

class Subscription extends Entity {
  constructor(handle, nodeHandle, typeClass, topic, callback, qos) {
    super(handle, typeClass, qos);
    this._topic = topic;
    this._callback = callback;
    this._message = new typeClass();
  }

  get takenMsg() {
    return this._message.toRawROS();
  }

  processResponse() {
    this._message.deserialize();
    this._callback(this._message);
  }

  static createSubscription(nodeHandle, typeClass, topic, callback, qos) {
    let type = typeClass.type();
    let handle = rclnodejs.createSubscription(nodeHandle, type.pkgName, type.subFolder, type.interfaceName, topic, qos);
    return new Subscription(handle, nodeHandle, typeClass, topic, callback, qos);
  }
};

module.exports = Subscription;
