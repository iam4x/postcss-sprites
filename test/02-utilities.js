import test from 'ava';
import {
	hasImageInRule,
	getImageUrl,
	isImageSupported,
	isRetinaImage,
	getRetinaRatio,
	getColor,
	makeSpritesheetPath,
	isToken
} from '../lib';

test('should detect background images in CSS rules', (t) => {
	const background = '.selector-b { background: url(square.png) no-repeat 0 0; }';
	const backgroundImage = '.selector-a { background-image: url(circle.png); }';
	const backgroundBlock = `
		.selector-b {
			color: #fff;
			background: url(square.png) no-repeat 0 0
		}
	`;
	const backgroundColor = '.selector-a { background: #fff; }';

	t.ok(hasImageInRule(background));
	t.ok(hasImageInRule(backgroundImage));
	t.ok(hasImageInRule(backgroundBlock));
	t.notOk(hasImageInRule(backgroundColor));
});

test('should return the url of an image', (t) => {
	const background = '.selector-b { background: url(square.png) no-repeat 0 0; }';
	const backgroundImage = '.selector-a { background-image: url(circle.png); }';
	const backgroundBlock = `
		.selector-b {
			color: #fff;
			background: url(square.png) no-repeat 0 0
		}
	`;
	const backgroundColor = '.selector-a { background: #fff; }';

	t.same(getImageUrl(background), 'square.png');
	t.same(getImageUrl(backgroundImage), 'circle.png');
	t.same(getImageUrl(backgroundBlock), 'square.png');
	t.same(getImageUrl(backgroundColor), '');
});

test('should remove get params', (t) => {
	const background = '.selector-b { background: url(square.png?v1234) no-repeat 0 0; }';
	t.same(getImageUrl(background), 'square.png');
});


test('should remove the quotes', (t) => {
	const background = '.selector-b { background: url("square.png") no-repeat 0 0; }';
	t.same(getImageUrl(background), 'square.png');
});

test('should allow only local files', (t) => {
	const local = 'sprite/test.png';
	const http = 'http://example.com/test.png';
	const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIA';

	t.ok(isImageSupported(local));
	t.notOk(isImageSupported(http));
	t.notOk(isImageSupported(base64));
});

test('should detect retina images', (t) => {
	const retina = 'sprite/test@2x.png';
	const nonRetina = 'sprite/test.png';

	t.ok(isRetinaImage(retina));
	t.notOk(isRetinaImage(nonRetina));
});

test('should extract the ratio of an image', (t) => {
	const nonRetina = 'sprite/test.png';
	const retina2x = 'sprite/test@2x.png';
	const retina3x = 'sprite/test@3x.png';

	t.same(getRetinaRatio(nonRetina), 1);
	t.same(getRetinaRatio(retina2x), 2);
	t.same(getRetinaRatio(retina3x), 3);
});

test('should extract color from declaration value', (t) => {
	const hexLong = '#000000 url(image.png)';
	const hexShort = '#000 url(image.png)';
	const rgb = 'rgb(255, 255, 255) url(image.png)';
	const rgba = 'rgb(255, 255, 255, .5) url(image.png)';
	const empty = 'url(image.png)';

	t.same(getColor(hexLong), '#000000');
	t.same(getColor(hexShort), '#000');
	t.same(getColor(rgb), 'rgb(255, 255, 255)');
	t.same(getColor(rgba), 'rgb(255, 255, 255, .5)');
	t.same(getColor(empty), null);
});

test('should generate spritesheet filename', (t) => {
	t.same(makeSpritesheetPath({ spritePath: './' }), 'sprite.png');
	t.same(makeSpritesheetPath({ spritePath: './' }, ['@2x']), 'sprite.@2x.png');
});

test('should detect comment tokens', (t) => {
	t.ok(isToken('/* @replace|circle.png */'));
	t.notOk(isToken('/* circle.png */'));
});
