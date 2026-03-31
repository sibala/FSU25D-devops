# Supabase – REST API URL Parameters

All patterns used to query Supabase via the REST API (fetch / plain URL).

---

## Base URL structure

```
https://<project>.supabase.co/rest/v1/<table>?<params>
```

Always include the API key as a header or query param:

```js
const headers = { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` };
```

Or as a query param (simpler, less secure):

```
?apikey=YOUR_KEY
```

---

## Select columns

```
?select=*                        // all columns
?select=id,title,price           // specific columns
?select=id,title,category(name)  // column from a joined table
```

---

## Filter rows

```
?id=eq.5                         // id = 5
?price=lt.100                    // price < 100
?price=lte.100                   // price <= 100
?price=gt.50                     // price > 50
?price=gte.50                    // price >= 50
?price=neq.0                     // price != 0
?title=is.null                   // value is NULL
?title=not.is.null               // value is NOT NULL
```

---

## Text search (LIKE / ILIKE)

```
?title=like.*bread*              // contains "bread" (case-sensitive)
?title=ilike.*bread*             // contains "bread" (case-insensitive)
?title=ilike.bread*              // starts with "bread"
?title=ilike.*bread              // ends with "bread"
```

> Use `*` as the wildcard (Supabase translates it to SQL `%`).

---

## Full-text search

```
?title=fts.fresh%20bread         // full-text search on a tsvector column
```

---

## IN / NOT IN

```
?id=in.(1,2,3)                   // id is 1, 2 or 3
?id=not.in.(4,5)                 // id is not 4 or 5
```

---

## Sorting

```
?order=price.asc                 // ascending
?order=price.desc                // descending
?order=price.asc.nullsfirst      // NULLs first
?order=price.desc.nullslast      // NULLs last
?order=price.asc,title.asc      // sort by multiple columns
```

---

## Pagination

```
?limit=10                        // max 10 rows
?offset=20                       // skip the first 20 rows
?limit=10&offset=20              // page 3 (items 21–30)
```

---

## Join tables (one-to-many)

Supabase uses foreign key relationships. Embed related rows with `select`:

```
?select=*,menus(*)               // include all columns from the menus table
?select=id,title,menus(name,price)  // specific columns from menus
```

> The joined table name must match the foreign key relationship defined in Supabase.

---

## Join tables (many-to-many)

Uses a junction table automatically when relationships are set up:

```
?select=*,tags(name)             // items with their tags via a junction table
```

---

## Combining params

```
?select=id,title,price&category=eq.bread&order=price.asc&limit=5
```

All params are combined with `&`. Filters on different columns are AND-ed together.

---

## OR filters

Use the `or` param:

```
?or=(price.lt.50,title.ilike.*cake*)   // price < 50 OR title contains "cake"
```

---

## Return a single row

Add the `Accept` header to get a single object instead of an array:

```js
const res = await fetch(`${BASE_URL}?id=eq.${id}&select=*`, {
  headers: { ...headers, Accept: "application/vnd.pgrst.object+json" },
});
const item = await res.json(); // object, not array
```

---

## Full example

```js
const BASE_URL = 'https://<project>.supabase.co/rest/v1/bakeries';
const API_KEY  = 'your-anon-key';

const res = await fetch(
  `${BASE_URL}?select=id,title,menus(name,price)&title=ilike.*bageri*&order=title.asc&limit=10`,
  { headers: { apikey: API_KEY } }
);
const data = await res.json(); // array of bakery objects, each with a menus array
```
