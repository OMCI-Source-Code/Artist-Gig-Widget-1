import React, { useState } from 'react';


export default function GigForm({ initial = {}, onSave }){
const [form, setForm] = useState({
title: initial.title || '',
date_time: initial.date_time ? initial.date_time.slice(0,16) : '',
venue: initial.venue || '',
description: initial.description || '',
link: initial.link || '',
private: initial.private || false,
});


function update(k, v){
setForm(prev => ({ ...prev, [k]: v }));
}


function submit(e){
e.preventDefault();
const body = { ...form, date_time: new Date(form.date_time).toISOString() };
onSave(body);
}


return (
<form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
<input placeholder="Title" value={form.title} onChange={e=>update('title', e.target.value)} required />
<input type="datetime-local" value={form.date_time} onChange={e=>update('date_time', e.target.value)} required />
<input placeholder="Venue" value={form.venue} onChange={e=>update('venue', e.target.value)} required />
<textarea placeholder="Description" value={form.description} onChange={e=>update('description', e.target.value)} rows={3} />
<input placeholder="Link (optional)" value={form.link} onChange={e=>update('link', e.target.value)} />
<label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
<input type="checkbox" checked={form.private} onChange={e=>update('private', e.target.checked)} /> Private (show only on your widget)
</label>
<button type="submit">Save</button>
</form>
);
}