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
 * @class - Class representing a Client in ROS
 * @hideconstructor
 */

class Client extends Entity {
  constructor(handle, serviceName, typeClass, qos) {
    super(handle, typeClass, qos);
    this._response = new typeClass.Response();
    this._serviceName = serviceName;
    this._sequenceNumber = 0;
  }

  /**
   * This callback is called when a resopnse is sent back from service
   * @callback ResponseCallback
   * @param {Object} response - The response sent from the service
   * @see [Client.sendRequest]{@link Client#sendRequest}
   * @see [Node.createService]{@link Node#createService}
   * @see {@link Client}
   * @see {@link Service}
   */

  /**
   * Send the request and will be notified asynchronously if receiving the repsonse.
   * @param {object} request - The request to be submitted.
   * @param {ResponseCallback} callback - Thc callback function for receiving the server response.
   * @return {undefined}
   * @see {@link ResponseCallback}
   */
  sendRequest(request, callback) {
    let rclRequest = request;
    if (typeof request !== 'object') {
      rclRequest = new this._typeClass();
      rclRequest.data = request;
    }
    if (typeof (callback) !== 'function') {
      throw new TypeError('Invalid argument');
    }

    rclRequest.serialize();
    let rawROSRequest = rclRequest.toRawROS();
    this._sequenceNumber = rclnodejs.sendRequest(this._handle, rawROSRequest);
    this._callback = callback;
  }

  get takenResponse() {
    return this._response.toRawROS();
  }

  get sequenceNumber() {
    return this._sequenceNumber;
  }

  processResponse() {
    this._response.deserialize();
    this._callback(this._response);
  }

  static createClient(nodeHandle, serviceName, typeClass, qos) {
    let type = typeClass.type();
    let handle = rclnodejs.createClient(nodeHandle, serviceName, type.interfaceName, type.pkgName, qos);
    return new Client(handle, serviceName, typeClass, qos);
  }
};

module.exports = Client;
