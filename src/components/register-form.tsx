"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let json: any = null;
      try { json = await res.json(); } catch {}

      if (res.ok) {
        setMessage(json?.message ?? "User created successfully");
        setMessageType('success');
        // attempt automatic login
        try {
          const loginRes = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, password: data.password })
          });
          let loginJson: any = null;
          try { loginJson = await loginRes.json(); } catch {}

          if (loginRes.ok) {
            // redirect to home
            form.reset();
            router.push('/');
            return;
          } else {
            setMessage(loginJson?.message ?? 'Login failed');
            setMessageType('error');
          }
        } catch (err) {
          setMessage('Login network error');
          setMessageType('error');
        }
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
    <div className="w-full max-w-md bg-red">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="text-white dark:text-black" aria-required>
                E-Mail
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="cristianpvp@cristianac.es"
                className="placeholder:text-gray-200 placeholder:dark:text-black text-white dark:text-black"
                required
                aria-required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="username" className="text-white dark:text-black" aria-required>
                Username
              </FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="CrIsTiiAnPvP"
                className="placeholder:text-gray-200 placeholder:dark:text-black text-white dark:text-black"
                required
                aria-required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-white dark:text-black" aria-required>
                Password
              </FieldLabel>
              <FieldDescription className="text-white/80 dark:text-black/80">
                Must be at least 8 characters.
              </FieldDescription>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="placeholder:text-gray-200 placeholder:dark:text-black text-white dark:text-black"
                required
                aria-required
                minLength={8}
                maxLength={64}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full px-4 py-2 rounded mb-2 text-sm mt-2 ${messageType === 'success' ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col justify-between mt-4 gap-2 items-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 font-semibold text-white bg-blue-600/50 rounded hover:bg-blue-700/70 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer active:scale-[0.975] transform duration-100 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
