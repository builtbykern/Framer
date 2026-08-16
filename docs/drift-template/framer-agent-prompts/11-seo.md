# Fase 11 — SEO

**Objetivo:** `lang=en`, titles, descriptions, OG, alts de placeholders. Sin mutar schema CMS.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **GPT 5.6 Terra** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/seo`**. Si no está: chat plano (Agents `#seo`) |
| @ | Site Settings, todas las páginas, Work |
| No usar | Fable, Sol, `/cms` schema, Unsplash |

Terra: Help — *large audits, consistency*.

## Prompt (después de constraints)

```
/seo

Site settings and metadata only. Do not redesign.

- Language: en
- Site title: VALE
- Site description: Selected work in stills. Series by Vale, visual director.
- Favicon: a simple ink mark on paper or home-bg. Not the Framer default if you can replace it with a 1-letter V. If you cannot generate an asset, leave a note for the human
- Home title: VALE — Visual director
- Info title: Info — VALE
- Contact title: Contact — VALE
- 404 title: Missing — VALE
- CMS detail title template: {Title} — VALE
- Descriptions unique per page, English, no lorem. Detail: use Description field or a short template from Title
- Open Graph: use Cover when the page is a Work item; Home can use home-bg until Lummi
- Alt text on placeholder covers: “Placeholder for {Title}” until phase 12. Decorative Nav marks: empty alt or alt=""

Do not publish. Do not add Index or Privacy.

Report: lang, each page title, leftover default “My Framer Site”.
```

## Definition of done

- Nada de “My Framer Site”. lang=en. Titles únicos.
- Alts de placeholders honestos.

## No tocar

Layout. Lummi (aún no).

## Verificación humana

Site Settings. Una detail preview title = “Salt Light — VALE”.

## Siguiente

**Parar.** Recorrer el sitio entero. Luego Lummi humano → fase 12.
