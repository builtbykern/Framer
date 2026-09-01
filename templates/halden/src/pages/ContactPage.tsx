import { useState, type FormEvent } from "react"

type InquiryType = "people" | "place" | "commission" | "other"

function inquiryLabel(type: InquiryType): string {
  switch (type) {
    case "people":
      return "People"
    case "place":
      return "Place"
    case "commission":
      return "Commission"
    case "other":
      return "Other"
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

const INQUIRY_TYPES: InquiryType[] = [
  "people",
  "place",
  "commission",
  "other",
]

export function ContactPage() {
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <main className="page page--narrow">
      <h1 className="page__kicker">Contact</h1>
      <p className="page__lead">
        Enquiries:{" "}
        <a href="mailto:studio@mirahalden.com">studio@mirahalden.com</a>
      </p>
      {sent ? (
        <p>Received. Mira will write back from the studio address.</p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <label className="form__field">
            Name
            <input name="name" type="text" required autoComplete="name" />
          </label>
          <label className="form__field">
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="form__field">
            Inquiry
            <select name="inquiry" defaultValue="other">
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {inquiryLabel(type)}
                </option>
              ))}
            </select>
          </label>
          <label className="form__field">
            Message
            <textarea name="message" rows={5} required />
          </label>
          <button className="form__submit" type="submit">
            Send
          </button>
        </form>
      )}
    </main>
  )
}
