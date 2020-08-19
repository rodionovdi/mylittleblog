export default class Article {
  constructor (
    id,
    title,
    description,
    fullDescription,
    color,
    comments = []
  ) {
    this.id = id
    this.title = title,
    this.description = description,
    this.fullDescription = fullDescription,
    this.color = color,
    this.comments = comments
  }
}