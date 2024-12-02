import { db } from "../../firebaseConfig.js";
import bcrypt from "bcrypt";

class UserController {
  // register
  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // Verifica se já existe usuário com o e-mail fornecido
    const userExists = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!userExists.empty) {
      return res.status(400).json({ error: "O e-mail já está em uso." });
    }

    // Verificador de senha
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      return res.status(400).json({
        error:
          "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection("users").add({
        name,
        email,
        password: hashedPassword,
      });

      return res
        .status(200)
        .json({ message: "Usuário adicionado com sucesso!" });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      return res.status(500).json({ error: "Erro ao adicionar usuário!" });
    }
  }
  // login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios!" });
    }

    try {
      const userQueryResult = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      if (userQueryResult.empty) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Pega os dados do primeiro usuário encontrado
      const userDoc = userQueryResult.docs[0];
      const user = userDoc.data();

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha incorreta." });
      }
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        user: {
          id: userDoc.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Usuário não encontrado!" });
    }
  }

  // change password
  async forgotPassword(req, res) {}
}

export default new UserController();
