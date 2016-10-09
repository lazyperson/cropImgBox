/*
 cropimgbox.js
 ------------------------------------------------------------
 |  Note:暂时提供了除原图外的2种效果（灰化、高亮高对比），可通过修改
 |  cvtColor、brightnessContrast函数在此基础上渐变多种效果。
 -------------------------------------------------------------
 *********注：基于cropbox修改 https://github.com/hongkhanh/cropbox *************
 Version: 1.0.0
 Author: lazyperson
 QQ: 564981089
 Website: https://github.com/lazyperson
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    "use strict";
    var cropimgbox = function (options, el) {
        options.expandRatio = options.expandRatio || 1.1;
        options.narrowRatio = options.narrowRatio || 0.9;
        var el = el || $(options.imageBox),
            obj =
            {
                state: {},
                ratio: 1,
                //clipType：裁剪后得到的效果图类型，1显示，0不显示。表示类型依次为 原图（必须有）|灰白图|高亮对比图
                clipType: '1|1|1',
                options: options,
                imageBox: el,
                thumbBox: el.find(options.thumbBox),
                spinner: el.find(options.spinner),
                image: new Image(),
                getDataURL: function (callfun) {
                    var width = this.thumbBox.width(),
                        height = this.thumbBox.height(),
                        canvas = document.createElement("canvas"),
                        dim = el.css('background-position').split(' '),
                        size = el.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el.width() / 2 + width / 2,
                        dy = parseInt(dim[1]) - el.height() / 2 + height / 2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;

                    var arr_result = [], arr = obj.clipType.split('|');

                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');
                    arr_result.push(imageData);

                    var _param = 0, key = '';
                    if (arr.length > 1 && arr[1] == '1') {
                        context.clearRect(0, 0, 10000, 10000);
                        key = 'gray';
                        var imgToGray = imgTrans(canvas, imageData, key, function () {
                            _param += 1;
                            imageData = canvas.toDataURL('image/png');
                            arr_result.push(imageData);
                        });
                    }
                    if (arr.length > 2 && arr[2] == '1') {
                        context.clearRect(0, 0, 10000, 10000);
                        key = 'bright';
                        var imgToGray = imgTrans(canvas, imageData, key, function () {
                            _param += 1;
                            imageData = canvas.toDataURL('image/png');
                            arr_result.push(imageData);
                        });
                    }


                    function imgTrans(iCanvas, url, key, callback) {
                        var _th = this;
                        var canvas = iCanvas,
                        iCtx = canvas.getContext("2d"),
                        url = url;

                        var imread = function (_image) {
                            var width = _image.width,
                                height = _image.height;
                            iResize(width, height);
                            iCtx.drawImage(_image, 0, 0);
                            var imageData = iCtx.getImageData(0, 0, width, height),
                                tempMat = new Mat(height, width, imageData.data);
                            imageData = null;
                            iCtx.clearRect(0, 0, width, height);
                            return tempMat;
                        },
                        iResize = function (_width, _height) {
                            canvas.width = _width;
                            canvas.height = _height;
                        },
                        RGBA2ImageData = function (_imgMat) {
                            var width = _imgMat.col,
                                height = _imgMat.row,
                                imageData = iCtx.createImageData(width, height);
                            imageData.data.set(_imgMat.data);
                            return imageData;
                        },
                        render = function (key, callback) {
                            var img = new Image();
                            img.onload = function () {
                                var myMat = imread(img);
                                if (key == 'gray') {
                                    var newImage = cvtColor(myMat, "CV_RGBA");
                                    var newIamgeData = RGBA2ImageData(newImage);
                                    iCtx.putImageData(newIamgeData, 0, 0);
                                }
                                if (key == 'bright') {
                                    var newImage = brightnessContrast(myMat, 50, 50);
                                    var newIamgeData = RGBA2ImageData(newImage);
                                    iCtx.putImageData(newIamgeData, 0, 0);
                                }
                                callback();
                            };
                            img.src = url;
                        };

                        render(key, callback);
                    }


                    function Mat(_row, _col, _data, _buffer) {
                        this.row = _row || 0;
                        this.col = _col || 0;
                        this.channel = 4;
                        this.buffer = _buffer || new ArrayBuffer(_row * _col * 4);
                        this.data = new Uint8ClampedArray(this.buffer);
                        _data && this.data.set(_data);
                        this.bytes = 1;
                        this.type = "CV_RGBA";
                    }

                    function cvtColor(_src, _code) {
                        var row = _src.row,
                            col = _src.col;
                        if (_src.type && _code === "CV_RGBA") {
                            var dst = new Mat(row, col),
                            data = dst.data,
                            data2 = _src.data;
                            var pix1, pix2, pix = _src.row * _src.col * 4;
                            while (pix) {
                                data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data2[pix] * 299 + data2[pix1] * 587 + data2[pix2] * 114) / 1000;
                                data[pix + 3] = data2[pix + 3];
                            }
                        } else if (_src.type && _code === "CV_RGBA2GRAY") {
                            var dst = new Mat(row, col),
                                    data = dst.data,
                                    data2 = _src.data;
                            var pix = row * col;
                            while (pix) {
                                data[--pix] = (data2[4 * pix] * 9798 + data2[4 * pix + 1] * 19235 + data2[4 * pix + 2] * 3736) >> 15;
                            }
                        }
                        return dst;
                    }

                    var brightnessContrast = function (__src, __brightness, __contrast) {
                        if (__src.type === "CV_RGBA") {
                            var sData = __src.data,
                                width = __src.col,
                                height = __src.row,
                                dst = new Mat(height, width);
                            var dData = dst.data,
                             brightness = Math.max(-255, Math.min(255, __brightness || 0)),
                             contrast = Math.max(-255, Math.min(255, __contrast || 0));

                            var gray = cvtColor(__src, "CV_RGBA2GRAY", 2),
                                allValue = 0,
                                gData = gray.data;
                            var y, x, c;

                            for (y = height; y--;) {
                                for (x = width; x--;) {
                                    allValue += gData[y * width + x];
                                }
                            }

                            var r, g, b, offset, gAverage = (allValue / (height * width)) | 0;

                            for (y = height; y--;) {
                                for (x = width; x--;) {
                                    offset = (y * width + x) * 4;
                                    dData[offset] = sData[offset] + brightness;
                                    dData[offset + 1] = sData[offset + 1] + brightness;
                                    dData[offset + 2] = sData[offset + 2] + brightness;

                                    if (contrast >= 0) {
                                        for (c = 3; c--;) {
                                            if (dData[offset + c] >= gAverage) {
                                                dData[offset + c] = dData[offset + c] + (255 - gAverage) * contrast / 255;
                                            } else {
                                                dData[offset + c] = dData[offset + c] - (gAverage * contrast / 255);
                                            }
                                        }
                                    } else {
                                        dData[offset] = dData[offset] + (dData[offset] - gAverage) * contrast / 255;
                                        dData[offset + 1] = dData[offset + 1] + (dData[offset + 1] - gAverage) * contrast / 255;
                                        dData[offset + 2] = dData[offset + 2] + (dData[offset + 2] - gAverage) * contrast / 255;
                                    }
                                    dData[offset + 3] = 255;
                                }
                            }
                        }
                        return dst;
                    };

                    var num = arr.length > 1 && arr[1] == '1' || arr.length > 2 && arr[2] == '1' ? (arr.length > 1 && arr[1] == '1' && arr.length > 2 && arr[2] == '1' ? 2 : 1) : 0;
                    if (arr.length > 1 && arr[1] == '1' || arr.length > 2 && arr[2] == '1') {
                        if (_param > 0)
                            return arr_result;
                        else {
                            (function func() {
                                if (_param >= num) {
                                    _param = 0;
                                    callfun(arr_result);
                                }
                                else
                                    setTimeout(func, 500);
                            })();
                        }
                    }
                },
                getBlob: function (i) {
                    var imageData = this.getDataURL()[i];
                    var b64 = imageData.replace('data:image/png;base64,', '');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], { type: 'image/png' });
                },
                zoomIn: function () {
                    this.ratio *= options.expandRatio;
                    setBackground();
                },
                zoomOut: function () {
                    this.ratio *= options.narrowRatio;
                    setBackground();
                }
            },
            setBackground = function () {
                var w = parseInt(obj.image.width) * obj.ratio;
                var h = parseInt(obj.image.height) * obj.ratio;

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;
                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w + 'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'
                });
            },
            imgMouseDown = function (e) {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function (e) {
                e.stopImmediatePropagation();

                if (obj.state.dragable) {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.css('background-position', bgX + 'px ' + bgY + 'px');

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function (e) {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function (e) {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio *= options.expandRatio : obj.ratio *= options.narrowRatio;
                setBackground();
            }

        obj.spinner.show();

        obj.image.onload = function () {
            obj.spinner.hide();
            setBackground();
            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };

        obj.image.src = options.imgSrc;
        el.on('remove', function () { $(window).unbind('mouseup', imgMouseUp) });

        return obj;
    };

    jQuery.fn.cropimgbox = function (options) {
        return new cropimgbox(options, this);
    };
}));


