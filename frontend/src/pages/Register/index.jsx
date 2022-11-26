import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../../api";
import "./index.css";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  return (
    <div>
      <Header screem="Register"></Header>

      <div className="register-user">
        <h1>Register</h1>
        <p className="description">
          Com a sua conta, você poderá gerenciar seus medicamentos.
        </p>

				<Formik
          initialValues={{
            name: '',
            cpf: '',
            date: '',
            email: '',
            password: '',
            repeatPassword: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Nome é requerido').max(50),
            cpf: Yup.string().required('CPF é requerido').min(13).max(15).matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'Cpf deve corresponder ao seguinte formato: xxx.xxx.xxx-xx.'),
            date: Yup.date().required('Data é requerido'),
            email: Yup.string().required('E-mail é requerido').email(),
            password: Yup.string().required('Senha é requerido').min(8).max(50).matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, 'A senha deve ter pelo menos 8 caracteres contendo letras, números e pelo menos um caractere especial.'),
            repeatPassword: Yup.string().required('Confirmação de senha é requerido').oneOf([Yup.ref('password'), null], 'Confirmação de senha deve ser igual a senha'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const {
              name: name_user,
              cpf,
              email,
              date: data_nascimento,
              password: senha,
              repeatPassword: confirmacao_senha,
            } = values;
            const user = { name_user, email, cpf, data_nascimento, senha, confirmacao_senha };
            
            try {
              const { data: { body: { cliente }, statusCode } } = await api.post('/users/create', user);

              if (statusCode === 201) {
                toast('Conta criada com sucesso!', {
                  icon: '👏',
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                });
              }
            } catch (error) {
              const errors = error.response.data.errors;
              const message = errors.map((error) =>  error.message).join(', ')
              toast.error(message, {
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              });
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form id="formRegister" onSubmit={handleSubmit}>
              <label htmlFor="name">Nome</label>
              <input
                id="username"
                name="name"
                placeholder="Escreva seu nome"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                className={touched.name && errors.name ? 'input-error' : null}
                required
              />
              {touched.name && errors.name ? (
                <small className="small-error">{errors.name}</small>
              ): null}

              <label htmlFor="cpf">CPF</label>
              <input
                id="usercpf"
                name="cpf"
                placeholder="Escreva seu CPF"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.cpf}
                className={touched.cpf && errors.cpf ? 'input-error' : ''}
                required
              />
              {touched.cpf && errors.cpf ? (
                <small className="small-error">{errors.cpf}</small>
              ): null}

              <label htmlFor="date">Data de nascimento</label>
              <input
                id="userdate"
                name="date"
                placeholder="Selecione sua data de nascimento"
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.date}
                className={touched.date && errors.date ? 'input-error' : null}
                required
              />
              {touched.date && errors.date ? (
                <small className="small-error">{errors.date}</small>
              ): null}

              <label htmlFor="email">E-mail</label>
              <input
                id="userEmail"
                name="email"
                placeholder="Escreva seu e-mail"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={touched.email && errors.email ? 'input-error' : null}
                required
              />
              {touched.email && errors.email ? (
                <small className="small-error">{errors.email}</small>
              ): null}

              <label htmlFor="password">Senha</label>
              <input
                id="userpassword"
                name="password"
                type="password"
                placeholder="Escreva sua senha"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className={touched.password && errors.password ? 'input-error' : null}
                required
              />
              {touched.password && errors.password ? (
                <small className="small-error">{errors.password}</small>
              ): null}
              <p className="password-condition">
                Use pelo menos 8 caracteres contendo letras, números e pelo menos
                um caractere especial
              </p>

              <label htmlFor="repeat-password">Repetir a Senha</label>
              <input
                id="userpasswordConfirm"
                name="repeatPassword"
                type="password"
                placeholder="Confirme sua senha"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.repeatPassword}
                className={touched.repeatPassword && errors.repeatPassword ? 'input-error' : null}
                required
              />
              {touched.repeatPassword && errors.repeatPassword ? (
                <small className="small-error">{errors.repeatPassword}</small>
              ): null}

              <button type="submit" className="btn btn-primary">
                <b>Registre-se</b>
              </button>
            </form>
          )}
        </Formik>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default Register;
