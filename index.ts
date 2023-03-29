import { btoa, atob } from './base64';

export function reduceSDP(sdp: string): string {
	let lines: string[] = sdp.split('\r\n');
	lines = lines.filter((line: string) => {
		return (
			(line.indexOf('a=candidate:') === 0 &&
				line.indexOf('typ relay') !== -1 &&
				line.charAt(14) === '1') ||
			line.indexOf('a=ice-ufrag:') === 0 ||
			line.indexOf('a=ice-pwd:') === 0 ||
			line.indexOf('a=fingerprint:') === 0
		);
	});
	lines = lines.sort().reverse();

	let firstcand = true;
	const comp = lines.map((line: string) => {
		switch (line.split(':')[0]) {
			case 'a=fingerprint':
				const hex = line.substr(22).split(':').map((h) => {
					return parseInt(h, 16);
				});
				return btoa(String.fromCharCode.apply(String, hex));
			case 'a=ice-pwd':
				return line.substr(10);
			case 'a=ice-ufrag':
				return line.substr(12);
			case 'a=candidate':
				const parts = line.substr(12).split(' ');
				const ip = parts[4].split('.').reduce((prev: string, cur: string) => {
					return ((parseInt(prev, 10) << 8) + parseInt(cur, 10)).toString();
				});
				if (firstcand) {
					firstcand = false;
					return [ip, parseInt(parts[5])]
						.map((a) => {
							return a.toString(32);
						})
						.join(',');
				} else {
					return [parseInt(parts[5])]
						.map((a) => {
							return a.toString(32);
						})
						.join(',');
				}
		}
	});
	return comp.join(',');
}

export function reduce(desc: RTCSessionDescriptionInit): string {
	const sdp = desc.sdp;
	if (!sdp) {
		throw new Error("SDP not found");
	}
	const comp = reduceSDP(sdp);

	return [desc.type === 'offer' ? 'O' : 'A'].concat(comp).join(',');
}

export function expandSDP(sdpMinStr: string, isOffer = true): string {
	const comp = sdpMinStr.split(',');

	let sdp: string[] = [
		'v=0',
		'o=- 5498186869896684180 2 IN IP4 127.0.0.1',
		's=-',
		't=0 0',
		'a=msid-semantic: WMS',
		'm=application 9 DTLS/SCTP 5000',
		'c=IN IP4 0.0.0.0',
		'a=mid:data',
		'a=sctpmap:5000 webrtc-datachannel 1024',
	];
	if (isOffer) {
		sdp.push('a=setup:actpass');
	} else {
		sdp.push('a=setup:active');
	}
	sdp.push('a=ice-ufrag:' + comp[0]);
	sdp.push('a=ice-pwd:' + comp[1]);
	sdp.push(
		'a=fingerprint:sha-256 ' +
		atob(comp[2])
			.split('')
			.map((c: string) => {
				let d = c.charCodeAt(0);
				let e = c.charCodeAt(0).toString(16).toUpperCase();
				if (d < 16) e = '0' + e;
				return e;
			})
			.join(':')
	);
	let candparts;
	candparts = comp.splice(3, 2).map((c: string) => {
		return parseInt(c, 32);
	});
	let ip = [
		(candparts[0] >> 24) & 0xff,
		(candparts[0] >> 16) & 0xff,
		(candparts[0] >> 8) & 0xff,
		candparts[0] & 0xff,
	].join('.');
	let cand = [
		'a=candidate:0',
		'1',
		'udp',
		'1',
		ip,
		candparts[1],
		'typ host',
	];
	sdp.push(cand.join(' '));
	let prio = 2;
	for (let i = 3; i < comp.length; i++) {
		cand = [
			'a=candidate:0',
			'1',
			'udp',
			prio++,
			ip,
			parseInt(comp[i], 32),
			'typ host',
		];
		sdp.push(cand.join(' '));
	}

	return sdp.join('\r\n') + '\r\n';
}

export function expand(str: string): RTCSessionDescriptionInit {
	const type = str[0];
	const sdpMinStr = str.slice(2);

	return {
		type: type === 'O' ? 'offer' : 'answer',
		sdp: expandSDP(sdpMinStr, type === 'O'),
	};
}
