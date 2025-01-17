import Header from "../../components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../../api";
import "./index.css";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { TextField } from "@material-ui/core";

const RegisterMedicine = () => {
  const { id } = useParams();
  const [limit, setLimit] = useState(10);
  const [medicine, setMedicine] = useState();
  const [medicines, setMedicines] = useState([]);
  const [meta, setMeta] = useState();
  const [selectedMedicine, setSelectedMedicine] = useState();
  const [date, setDate] = useState("04:20");

  const fetchMedicines = async (search = "", options, { page }) => {
    try {
      page = page || 1;
      const { data } = await api.get(
        `/medicines?page=${page}&limit=${limit}&search=${search}`
      );
      if (data.statusCode === 200) {
        setMeta(data.body.medicamentos.meta);
        const hasMore = data.body.medicamentos.meta.last_page > page;
        const options = data.body.medicamentos.data.map((medicine) => ({
          value: medicine.id,
          label:
            medicine.nome.replace(/"/g, "").toLowerCase() +
            " - " +
            medicine.farmaceutica
              .replace(/"/g, "")
              .toLowerCase()
              .split(" - ")[1],
        }));
        setMedicines(options);
        return {
          options,
          hasMore,
          additional: {
            page: page + 1,
          },
        };
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
  };
  
  const fetchEditMedicine = async () => {
    try {
      const { data } = await api.get(`/medicines/get-by-id/${id}`);
      console.log(id, data);
      if (data.statusCode === 200) {
        setDate(data.body.gerenciamento.hora_gerenciamento);
        setSelectedMedicine(data.body.gerenciamento.medicamento.id);
      }
    } catch (error) {
      const errors = error.response.data.errors;
      const message = errors.map((error) => error.message).join(", ");
      toast.error(message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useMemo(() => {
    fetchEditMedicine();
  }, []);
  
  return (
    <div>
      <Header screem="EditMedicine"></Header>

      <div className="edit">
        <h1>Editar Medicamento</h1>

        <Formik
          initialValues={{}}
          onSubmit={async () => {
            const med = { horaGerenciamento: date, idMedicamento: medicine.value };
            try {
              const {
                data: { body: statusCode }
              } = await api.put(`/medicines/update/${id}`, med);

              if (statusCode === 200) {
                toast("Medicamento editado com sucesso!", {
                  icon: "👏",
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });
              }
            } catch (error) {
              const errors = error.response.data.errors;
              const message = errors.map((error) => error.message).join(", ");
              toast.error(message, {
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
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
            <form id="formCadastro" onSubmit={handleSubmit}>
              <div>
                <AsyncPaginate
                  className="input"
                  placeholder="Medicamento"
                  value={medicine}
                  loadOptions={fetchMedicines}
                  onChange={setMedicine}
                  additional={{
                    page: 1,
                  }}
                />
              </div>

              <label htmlFor="time">Hora</label>
              <TextField
                  id="outlined-basic"
                  value={date}
                  type="time"
                  placeholder="Hora"
                  className="input"
                  variant="outlined"
                  onChange={(e) => setDate(e.target.value)}
                />
              {touched.hour && errors.hour ? (
                <small className="small-error">{errors.hour}</small>
              ) : null}

              <button type="submit" className="btn btn-primary">
                <b>Editar</b>
              </button>
            </form>
          )}
        </Formik>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default RegisterMedicine;
