/*
 Navicat MySQL Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : zhiyun

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 31/03/2022 15:32:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for album
-- ----------------------------
DROP TABLE IF EXISTS `album`;
CREATE TABLE `album`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '相册名',
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `相册用户id`(`userId`) USING BTREE,
  CONSTRAINT `相册用户id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of album
-- ----------------------------
INSERT INTO `album` VALUES (40, '海贼王', '123');

-- ----------------------------
-- Table structure for dict
-- ----------------------------
DROP TABLE IF EXISTS `dict`;
CREATE TABLE `dict`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '字段唯一标识',
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '字段展示名',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '该记录所属字段类型',
  `desc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dict
-- ----------------------------
INSERT INTO `dict` VALUES (1, 'rl', '日历', '工具', '工具列表');
INSERT INTO `dict` VALUES (2, 'mb', '秒表', '工具', '工具列表');

-- ----------------------------
-- Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS `event`;
CREATE TABLE `event`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '事件标题',
  `detail` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件描述',
  `date` date NOT NULL COMMENT '事件开始时间（年月日）',
  `time` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件开始时间（时分秒）',
  `imgs` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件附加照片',
  `files` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件附加文件',
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `事件用户id`(`userId`) USING BTREE,
  CONSTRAINT `事件用户id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of event
-- ----------------------------

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `path` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '存储路径',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '原文件名',
  `size` bigint(0) NULL DEFAULT NULL COMMENT '文件大小',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file
-- ----------------------------

-- ----------------------------
-- Table structure for music
-- ----------------------------
DROP TABLE IF EXISTS `music`;
CREATE TABLE `music`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '音乐名',
  `artist` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '艺人',
  `album` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专辑',
  `time` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '时长',
  `count` int(0) NULL DEFAULT NULL COMMENT '播放次数',
  `userId` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户id',
  `path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件存储路径',
  `fileName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件名',
  `sheet` int(0) NULL DEFAULT NULL COMMENT '歌单',
  `coverPath` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片路径',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `音乐用户id`(`userId`) USING BTREE,
  INDEX `音乐所在歌单`(`sheet`) USING BTREE,
  CONSTRAINT `音乐用户id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 414 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of music
-- ----------------------------

-- ----------------------------
-- Table structure for photo
-- ----------------------------
DROP TABLE IF EXISTS `photo`;
CREATE TABLE `photo`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userId` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户id',
  `type` int(0) NOT NULL COMMENT '分类名称',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片路径',
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片名',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `照片所在相册id`(`type`) USING BTREE,
  INDEX `照片用户id`(`userId`) USING BTREE,
  CONSTRAINT `照片所在相册id` FOREIGN KEY (`type`) REFERENCES `album` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `照片用户id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1655 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of photo
-- ----------------------------

-- ----------------------------
-- Table structure for power
-- ----------------------------
DROP TABLE IF EXISTS `power`;
CREATE TABLE `power`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '权限名称',
  `url` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限路径',
  `details` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 93 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of power
-- ----------------------------
INSERT INTO `power` VALUES (30, '上传照片', '/uploadPic', NULL, '相册');
INSERT INTO `power` VALUES (31, '获取各个相册信息', '/getTypeAndPic', '获取所有相册名称和相册最后一张照片和各个相册照片总数', '相册');
INSERT INTO `power` VALUES (32, '条件查询照片', '/getPhotos', '获取相册的照片总数,相册名称和照片', '相册');
INSERT INTO `power` VALUES (33, 'zui组件上传图片', '/savePhoto', '配合zui上传组件使用的上传功能接口', '相册');
INSERT INTO `power` VALUES (34, '新建相册', '/createType', NULL, '相册');
INSERT INTO `power` VALUES (35, '批量删除相册', '/deleteTypes', NULL, '相册');
INSERT INTO `power` VALUES (36, '批量删除图片', '/deletePhotos', NULL, '相册');
INSERT INTO `power` VALUES (37, '批量移动图片', '/movePhotos', '移动图片到其他相册', '相册');
INSERT INTO `power` VALUES (38, '获取用户相册列表', '/getTypesOfUser', NULL, '相册');
INSERT INTO `power` VALUES (44, '音乐播放次数加一', '/addCount', NULL, '音乐');
INSERT INTO `power` VALUES (45, '上传音乐', '/uploadMusic', NULL, '音乐');
INSERT INTO `power` VALUES (46, '获取音乐列表', '/getList', '根据歌单和搜索条件获取音乐列表', '音乐');
INSERT INTO `power` VALUES (47, '获取歌单列表', '/getSheets', NULL, '音乐');
INSERT INTO `power` VALUES (48, '获取艺人列表', '/getArtists', NULL, '音乐');
INSERT INTO `power` VALUES (49, '根据艺人获取专辑', '/getAlbumByArtist', NULL, '音乐');
INSERT INTO `power` VALUES (50, '获取艺人专辑跟歌曲', '/getArtistAlbumMusic', NULL, '音乐');
INSERT INTO `power` VALUES (51, '删除音乐', '/deleteMusics', NULL, '音乐');
INSERT INTO `power` VALUES (52, '新建歌单', '/addSheet', NULL, '音乐');
INSERT INTO `power` VALUES (53, '添加音乐到歌单', '/addMusicToSheet', NULL, '音乐');
INSERT INTO `power` VALUES (54, '删除歌单', '/deleteSheet', NULL, '音乐');
INSERT INTO `power` VALUES (55, '下载音乐', '/downloadMusic', NULL, '音乐');
INSERT INTO `power` VALUES (56, '获取用户所有歌单及其信息', '/getSheetsInfo', NULL, '音乐');
INSERT INTO `power` VALUES (57, '修改歌单', '/updateSheet', NULL, '音乐');
INSERT INTO `power` VALUES (58, '歌曲列表歌单信息', '/getSheetOfAllMusic', '全部歌曲的歌单信息', '音乐');
INSERT INTO `power` VALUES (59, '查询单个歌单信息', '/getSheet', NULL, '音乐');
INSERT INTO `power` VALUES (60, '权限分页查询', '/getPower', NULL, '权限配置');
INSERT INTO `power` VALUES (61, '全部权限字典表', '/getPowerDict', NULL, '权限配置');
INSERT INTO `power` VALUES (62, '删除权限', '/deletePower', NULL, '权限配置');
INSERT INTO `power` VALUES (63, '新增修改权限', '/savePower', NULL, '权限配置');
INSERT INTO `power` VALUES (64, '角色分页查询', '/getRole', NULL, '角色管理');
INSERT INTO `power` VALUES (65, '新增修改角色', '/saveRole', '包括修改角色权限', '角色管理');
INSERT INTO `power` VALUES (66, '删除角色', '/deleteRole', NULL, '角色管理');
INSERT INTO `power` VALUES (67, '用户分页查询', '/getUser', NULL, '用户管理');
INSERT INTO `power` VALUES (68, '删除用户', '/deleteUser', NULL, '用户管理');
INSERT INTO `power` VALUES (69, '新增修改用户', '/saveUser', NULL, '用户管理');
INSERT INTO `power` VALUES (70, '角色字典表', '/getRoleDict', NULL, '角色管理');
INSERT INTO `power` VALUES (71, '相册', '/album.html', NULL, '访问页面');
INSERT INTO `power` VALUES (72, '音乐', '/music.html', NULL, '访问页面');
INSERT INTO `power` VALUES (75, '管理', '/admin.html', NULL, '访问页面');
INSERT INTO `power` VALUES (76, '获取角色信息', '/userInfo', NULL, '首页');
INSERT INTO `power` VALUES (77, '编辑用户资料', '/updateUser', '用户自行修改用户名等资料', '首页');
INSERT INTO `power` VALUES (78, '上传头像', '/updateUserHead', NULL, '首页');
INSERT INTO `power` VALUES (80, '工具', '/tools.html', NULL, '访问页面');
INSERT INTO `power` VALUES (81, '获取角色可访问页面', '/getRolePage', NULL, '角色管理');
INSERT INTO `power` VALUES (83, '获取工具字典', '/tools/getToolDict', NULL, '工具');
INSERT INTO `power` VALUES (84, '工具使用权限判断', '/tools/queryToolPower', NULL, '工具');
INSERT INTO `power` VALUES (85, '保存日历事件', '/tools/rili/saveEvent', NULL, '工具');
INSERT INTO `power` VALUES (86, '获取日历事件', '/tools/rili/getEvents', NULL, '工具');
INSERT INTO `power` VALUES (87, '删除日历事件', '/tools/rili/deleteEvent', NULL, '工具');
INSERT INTO `power` VALUES (88, '上传事件图片', '/tools/rili/uploadEventImgs', NULL, '工具');
INSERT INTO `power` VALUES (89, '上传日历事件文件', '/tools/rili/uploadEventFiles', NULL, '工具');
INSERT INTO `power` VALUES (90, '根据id查询文件信息', '/tools/getFiles', NULL, '工具');
INSERT INTO `power` VALUES (91, '修改相册名', '/album/updateAlbum', NULL, '相册');
INSERT INTO `power` VALUES (93, '保存歌单', '/album/saveSheet', NULL, '音乐');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名称',
  `power` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色权限',
  `details` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色描述',
  `tools` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色可用工具',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'admin', '30,31,32,33,34,35,36,37,38,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,75,76,77,78,80,81,83,84,85,86,87,88,89,90,91,93', '最高权限', 'mb,rl');
INSERT INTO `role` VALUES (2, '普通用户', '30,31,32,33,34,35,36,37,38,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,71,72,76,77,78,80,81,91,93', NULL, 'rl');

-- ----------------------------
-- Table structure for sheet
-- ----------------------------
DROP TABLE IF EXISTS `sheet`;
CREATE TABLE `sheet`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userId` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户ID',
  `sheetName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '歌单名',
  `coverImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片路径',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `歌单用户id`(`userId`) USING BTREE,
  CONSTRAINT `歌单用户id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sheet
-- ----------------------------
INSERT INTO `sheet` VALUES (24, '123', '粤语', 'public/image/20211229/1cce079c0550455190d394040191c27e.jpg');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userId` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户id（手机号）',
  `password` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `role` int(0) NULL DEFAULT NULL COMMENT '角色',
  `headImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户头像',
  `userName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名称',
  PRIMARY KEY (`id`, `userId`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  INDEX `用户权限`(`role`) USING BTREE,
  CONSTRAINT `用户权限` FOREIGN KEY (`role`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '123', '123', 1, 'public/image/20211216/b566396717e9427781d929e4671bd4a7.JPG', 'admin');
INSERT INTO `user` VALUES (2, '222', '222', 2, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
