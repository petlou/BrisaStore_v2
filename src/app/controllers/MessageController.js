class MessageController {
  async store(req, res) {
    return res.json('Message Store');
  }
}

export default new MessageController();
