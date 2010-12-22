/**
 * Copyright (c) 2010 thegoldenmule
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * ****************************************************************************
 * 
 * GMTerrain - Basic terrain generator. This object constructs a 2D height map
 * which can be used as a full 3D terrain or a cross secion can be taken for a
 * basic 2D landscape. There are currently two types of generation called
 * limited random and circle hill. Settings are self explanatory.
 * 
 * Array2 - This file also contains a very simple and fast implementation of a
 * two dimensional array.
 */
GMTerrain = function() {
	var _that = this;
	
	// both generation types
	this.minimumHeight = 50;
	this.maximumHeight = 500;
	this.width = 40;
	this.height = 40;
	
	// limited random specific
	this.lr_maximumHeightIncrease = 60;
	
	// circle hill specific
	this.ch_numCircles = 15;
	this.ch_circleRadius = 20;
	this.ch_circleHeightIncrease = 80;
	
	function generateLimitedRandom() {
		var heightMap = new Array2(_that.width, _that.height);
		
		for(var i = 0; i < _that.width - 1; i++){
			for(var j = 0; j < _that.height - 1; j++){
				var a = 0;
				if(i != 0 && j != 0){
					a = (heightMap.get(i - 1, j) + heightMap.get(i, j - 1)) / 2;
				}
				else if( i != 0 && j == 0 ){
					a = heightMap.get(i - 1, j);
				}
				else{
					a = Math.random() * _that.height;
				}
				var h = a + _that.lr_maximumHeightIncrease * (Math.random() - 1 / 2);
				heightMap.set(i, j, Math.max(_that.minimumHeight, Math.min(h, _that.maximumHeight)));
			}
		}
		
		return heightMap;
	};
	
	function generateCircleHill() {
		var circleRadiusSquared = _that.ch_circleRadius * _that.ch_circleRadius;
		
		var heightMap = new Array2(_that.width, _that.height);
		heightMap.fill(50);
		
		for(var pd_i = 1; pd_i < _that.ch_numCircles; pd_i++){
			var pd_x = ~~(Math.random() * _that.width);
			var pd_y = ~~(Math.random() * _that.height);
			for(var pd_j = 0; pd_j < _that.width - 1; pd_j++){
				for(var pd_k = 0; pd_k < _that.height - 1; pd_k++){
					var pd_d = (pd_x - pd_j)*(pd_x - pd_j) + (pd_y - pd_k)*(pd_y - pd_k);
					if(pd_d < circleRadiusSquared){
						var pd_a = (_that.ch_circleHeightIncrease / 2) * (1 + Math.cos(Math.PI * pd_d / (circleRadiusSquared)));
						heightMap.set(
							pd_j,
							pd_k,
							Math.min(heightMap.get(pd_j, pd_k) + pd_a, _that.maximumHeight));
					}
				}
			}
		}
		
		return heightMap;
	};
	
	this.generate = function(mode) {
		if (mode == GMTerrain.TYPE_CIRCLEHILL) {
			return generateCircleHill();
		} else if (mode == GMTerrain.TYPE_LIMITEDRANDOM) {
			return generateLimitedRandom();
		} else {
			throw new Error("Invalid generation mode.");
		}
	};
};

GMTerrain.TYPE_CIRCLEHILL = "circleHill";
GMTerrain.TYPE_LIMITEDRANDOM = "limitedRandom";

/**
 * Simple and fast two dimensional array implementation.
 */
Array2 = function (width, height) {
	this.getWidth = function() {
		return width;
	};
	this.getHeight = function() {
		return height;
	};
	this.get = function(x, y) {
		var index = getIndex(x, y);
		if (index >= 0 && index < _data.length) return _data[index];
		
		return undefined;
	};
	this.set = function(x, y, value) {
		_data[getIndex(x, y)] = value;
	};
	this.fill = function(value) {
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				_data[getIndex(i, j)] = value;
			}
		}
	};
	
	// private
	var _data = [];
	function getIndex(x, y) {
		return x + y * width;
	};
};