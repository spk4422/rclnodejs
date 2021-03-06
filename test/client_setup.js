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

const rclnodejs = require('../index.js');

rclnodejs.init().then(function() {
  var node = rclnodejs.createNode('service');
  var AddTwoInts = rclnodejs.require('example_interfaces').srv.AddTwoInts;
  var client = node.createClient(AddTwoInts, 'add_two_ints');
  var request = new AddTwoInts.Request();
  request.a = 1;
  request.b = 2;
  client.sendRequest(request, function(response) {
    process.stdout.write(response.sum.toString());
  });
  rclnodejs.spin(node);

  process.on('SIGINT', function() {
    node.destroy();
    rclnodejs.shutdown();
    process.exit(0);
  });
}).catch(function(err) {
  console.log(err);
});
