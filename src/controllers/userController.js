import { db, auth } from "../../firebaseConfig.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class UserController {
  // register
  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "E-mail inválido." });
    }

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
      const userExists = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!userExists.empty) {
        return res.status(400).json({ error: "O e-mail já está em uso." });
      }

      const userRecord = await auth.createUser({
        email,
        password,
      });

      await db.collection("users").doc(userRecord.uid).set({
        name,
        email,
      });

      return res
        .status(201)
        .json({ message: "Usuário adicionado com sucesso!" });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error.message, error.stack);
      if (error.code === "auth/email-already-in-use") {
        return res.status(400).json({ error: "O e-mail já está em uso." });
      }
      return res.status(500).json({ error: "Erro ao adicionar usuário!" });
    }
  }

  // login
  async login(req, res) {
    const { token } = req.body;


    if (!token) {
      return res.status(400).json({ error: "Token de autenticação é necessário!" });
    }

    try {
      // Verifica o token usando o Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;

      // Você pode adicionar mais verificações, como verificar se o e-mail corresponde ao uid, etc.
      const user = await db.collection("users").doc(uid).get();

      if (!user.exists) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json({
        message: "Login bem-sucedido!",
        user: user.data(), // Enviar os dados do usuário ou outro necessário
      });
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      return res.status(500).json({ error: "Erro ao autenticar usuário!" });
    }
  }

  async verifyToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      return uid; // Retorna o UID do usuário autenticado
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  // change password
  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório!" });
    }

    try {
      const userExistsInAuth = await auth.getUserByEmail(email);
      if (!userExistsInAuth) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const resetPasswordLink = await auth.generatePasswordResetLink(email);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD,
        },
      });

      const message = {
        to: email,
        subject: "Redefinição de senha - To Do List",
        text: `Clique no link para redefinir sua senha: ${resetPasswordLink}`,
        html: `<p>Clique no link para redefinir sua senha:</p> <a href="${resetPasswordLink}">Redefinir senha</a>`,
      };

      await transporter.sendMail(message);

      return res.status(200).json({
        message: "Link de redefinição de senha gerado com sucesso!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao gerar link de redefinição de senha." });
    }
  }
}

export default new UserController();
