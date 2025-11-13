"use client"

import { FieldSet } from "@/components/ui/field";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export default function UrlForm(){
	const [value, setValue] = useState('');
	const [liveValid, setLiveValid] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
	const [shortUrl, setShortUrl] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		let t: ReturnType<typeof setTimeout> | null = null;
		if (messageType === 'success' && message) {
			// auto-hide success message after 4s
			t = setTimeout(() => {
				setMessage(null);
				setMessageType(null);
			}, 4000);
		}

		return () => { if (t) clearTimeout(t); };
	}, [messageType, message]);

	function validateForDisplay(v: string){
		const t = v.trim();
		if (!t) return null;
		// try with scheme, if missing assume https for validation
		const tryValue = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(t) ? t : `https://${t}`;
		try {
			const p = new URL(tryValue);
			// require hostname contains a dot + valid TLD (reject plain words like "asdsdadas")
			const host = p.hostname || '';
			const hostValid = /\.[a-zA-Z]{2,}$/.test(host) && /^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/.test(host);
			return ["http:", "https:"].includes(p.protocol) && hostValid;
		} catch { return false; }
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;
		setValue(v);
		setLiveValid(validateForDisplay(v));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
		e.preventDefault();
		setMessage(null);
		setMessageType(null);
		setShortUrl(null);
		setLoading(true);

		let url = value.trim();
		if (!url) {
			setMessage('Please enter a URL');
			setMessageType('error');
			setLoading(false);
			return;
		}

		if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
			url = `https://${url}`;
		}

		// final validation: ensure protocol and hostname look valid (must include domain)
		try {
			const p = new URL(url);
			if (!["http:", "https:"].includes(p.protocol)) throw new Error('invalid-protocol');
			const host = p.hostname || '';
			const hostValid = /\.[a-zA-Z]{2,}$/.test(host) && /^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/.test(host);
			if (!hostValid) throw new Error('invalid-host');
		} catch {
			setMessage('Please enter a valid URL with a domain (e.g. example.com) and http:// or https://');
			setMessageType('error');
			setLoading(false);
			return;
		}

		try {
			// obtain session (server reads httpOnly cookie) via GET /api/users
			let userId: string | null = null;
			try {
				const sres = await fetch('/api/users');
				if (sres.ok) {
					const sjson = await sres.json();
					userId = sjson?.session?.userId ?? null;
				}
			} catch { userId = null; }

			const payload: any = { url };
			if (userId) payload.userId = userId;

			const res = await fetch('/api/url/shorten', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			let json: any = null;
			try { json = await res.json(); } catch {}

			if (res.ok) {
				const result = json?.shortUrl ?? json?.short ?? null;
				let finalUrl: string | null = null;
				if (result) {
					const r = String(result);
					// if backend returned a full URL or contains a dot, use it directly
					if (/^https?:\/\//i.test(r) || r.includes('.')) {
						finalUrl = r.startsWith('http') ? r : `https://${r}`;
					} else {
						// backend returned only the short token (cif) — build full domain
						const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'cristianac.es';
						finalUrl = `https://${r}.${domain}`;
					}
				}
				setShortUrl(finalUrl);
				setMessage(json?.message ?? 'URL shortened');
				setMessageType('success');
				setValue('');
				setLiveValid(null);
			} else {
				setMessage(json?.message ?? `Error: ${res.status}`);
				setMessageType('error');
			}
		} catch (err) {
			setMessage('Network error');
			setMessageType('error');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-lg">
			<FieldSet>
				<div className="flex gap-2 items-center">
					<Input
						id="url"
						name="url"
						type="text"
						value={value}
						onChange={handleChange}
						placeholder="https://cristianac.es"
						className="flex-1 placeholder:text-gray-200 placeholder:dark:text-black text-white dark:text-black"
					/>
					<button
						type="submit"
						disabled={loading}
						className={`px-4 py-2 font-semibold text-white bg-blue-600/50 rounded hover:bg-blue-700/70 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer active:scale-[0.975] transform duration-100 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
						{loading ? 'Shortening...' : 'Shorten'}
					</button>
				</div>
			</FieldSet>

			{liveValid === false && (
				<div className="mt-2 text-sm text-red-300">Invalid URL</div>
			)}

			{message && (
				<div role="status" aria-live="polite" className={`w-full px-4 py-2 rounded mt-2 text-sm ${messageType === 'success' ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
					{message}
				</div>
			)}

			{shortUrl && (
				<div className="mt-2 flex items-center gap-2">
					<a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-300 underline break-all">{shortUrl}</a>
					<button
						type="button"
						aria-label="Copy short url"
						onClick={async () => {
							try {
								if (shortUrl) {
									await navigator.clipboard.writeText(shortUrl);
									setCopied(true);
									setTimeout(() => setCopied(false), 2000);
								}
							} catch (err) {
								setMessage('Copy failed');
								setMessageType('error');
							}
						}}
						className="p-1 rounded hover:bg-white/10"
					>
						<Copy size={16} className="text-white" />
					</button>
					{copied && <span className="text-sm text-green-300">Copied!</span>}
				</div>
			)}
		</form>
	)
}
