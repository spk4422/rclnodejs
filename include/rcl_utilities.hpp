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

#include <string>

#ifndef RCLNODEJS_RCL_UTILITIES_HPP_
#define RCLNODEJS_RCL_UTILITIES_HPP_

class rosidl_message_type_support_t;

namespace rclnodejs {

const rosidl_message_type_support_t* GetMessageTypeSupportByMessageType(
    const std::string& package_name,
    const std::string& sub_folder,
    const std::string& msg_name);

}  // namespace rclnodejs

#endif
