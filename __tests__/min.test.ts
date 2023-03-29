import * as min from '../index';

const expanded: RTCSessionDescriptionInit = {
	type: "offer",
	sdp:
		"v=0\r\no=- 5498186869896684180 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na" +
		"=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0" +
		".0\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\na=setup:a" +
		"ctpass\r\na=ice-ufrag:tCjVOmVGpVZjCem/\r\na=ice-pwd:dOU77RWjJ8qQNb5OTz6" +
		"D+U7h\r\na=fingerprint:sha-256 C2:AE:C3:9B:C2:BE:7E:C2:9B:17:45:C2:A7:C" +
		"2:A5:54:40:C2:A8:66:19:11:5C:C3:B2:34:C3:88:0A:C2:B9:C2:85:32:70:09:2E:" +
		"C2:A9:C2:91:C2:A2:C2:82:C3:A8:71\r\na=candidate:0 1 udp 1 0.0.0.0  typ " +
		"host\r\n",
};
const compact =
	"O,tCjVOmVGpVZjCem/,dOU77RWjJ8qQNb5OTz6D+U7h,wq7Dm8K+fsKbF0XCp8K" +
	"lVEDCqGYZEVzDsjTDiArCucKFMnAJLsKpwpHCosKCw6hx";
const expandedSDP =
	"v=0\r\no=- 5498186869896684180 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na" +
	"=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0" +
	".0\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\na=setup:a" +
	"ctpass\r\na=ice-ufrag:tCjVOmVGpVZjCem/\r\na=ice-pwd:dOU77RWjJ8qQNb5OTz6" +
	"D+U7h\r\na=fingerprint:sha-256 C2:AE:C3:9B:C2:BE:7E:C2:9B:17:45:C2:A7:C" +
	"2:A5:54:40:C2:A8:66:19:11:5C:C3:B2:34:C3:88:0A:C2:B9:C2:85:32:70:09:2E:" +
	"C2:A9:C2:91:C2:A2:C2:82:C3:A8:71\r\na=candidate:0 1 udp 1 0.0.0.0  typ " +
	"host\r\n";
const compactSDP =
	"tCjVOmVGpVZjCem/,dOU77RWjJ8qQNb5OTz6D+U7h,wq7Dm8K+fsKbF0XCp8K" +
	"lVEDCqGYZEVzDsjTDiArCucKFMnAJLsKpwpHCosKCw6hx";

const originSDP2 = 'v=0\r\no=- 4069511839785042696 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=candidate:3071413192 1 udp 2113937151 6193c675-fd72-4408-92ba-46a8c789037a.local 52153 typ host generation 0 network-cost 999\r\na=candidate:3447031499 1 udp 2113939711 887be98c-cfce-454c-b533-45aa28237965.local 52154 typ host generation 0 network-cost 999\r\na=ice-ufrag:w+iU\r\na=ice-pwd:LtW8gnchDJTSmThKSg0BOrjJ\r\na=ice-options:trickle\r\na=fingerprint:sha-256 96:E1:D4:83:DA:71:50:65:FB:F9:2D:42:D0:FD:D7:B5:68:E8:C7:E1:68:73:6C:32:02:8B:A4:33:0A:9B:F6:EC\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n';
const compactSDP2 = 'w+iU,LtW8gnchDJTSmThKSg0BOrjJ,luHUg9pxUGX7+S1C0P3XtWjox+Foc2wyAoukMwqb9uw='
const expandedSDP2 = 'v=0\r\no=- 5498186869896684180 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\na=setup:active\r\na=ice-ufrag:w+iU\r\na=ice-pwd:LtW8gnchDJTSmThKSg0BOrjJ\r\na=fingerprint:sha-256 96:E1:D4:83:DA:71:50:65:FB:F9:2D:42:D0:FD:D7:B5:68:E8:C7:E1:68:73:6C:32:02:8B:A4:33:0A:9B:F6:EC\r\na=candidate:0 1 udp 1 0.0.0.0  typ host\r\n'

describe("minimize", () => {
	test("reduce", () => {
		expect(min.reduce(expanded)).toEqual(compact);
	});

	test("expand", () => {
		expect(min.expand(compact)).toEqual(expanded);
	});

	test("reduceSDP", () => {
		expect(min.reduceSDP(expandedSDP)).toEqual(compactSDP);
	});

	test("expandSDP", () => {
		expect(min.expandSDP(compactSDP, true)).toEqual(expandedSDP);
	});

	test("reduceSDP2", () => {
		expect(min.reduceSDP(originSDP2)).toEqual(compactSDP2);
	});

	test("expandSDP2", () => {
		console.log('test:', JSON.stringify(min.expandSDP(compactSDP2, false)))
		expect(min.expandSDP(compactSDP2, false)).toEqual(expandedSDP2);
	});
});
