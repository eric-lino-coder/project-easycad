// 1. Importar React (necessário dependendo da configuração)
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/system";

// 2. Definir os tipos das propriedades (Props)
interface RoleProps {}

// 3. Criar o componente funcional
const ModalForm: React.FC<any> = ({
  tituloModal,
  role,
  onClose,
  form,
  getErrorProps,
  handleChange,
  handleSalvar,
}) => {
  return (
    <>
      <DialogTitle sx={{ background: "#1A4173", color: "#fff", mb: 2 }}>
        {tituloModal} {role?.nome?.toUpperCase()}
        <IconButton
          onClick={() => onClose(false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: "bold", color: "#1A4173" }}
        >
          Dados do Perfil
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              label="Nome"
              value={form.name || ""}
              {...getErrorProps("name")}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Descrição"
              value={form.description || ""}
              {...getErrorProps("description")}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup
                name="radio-buttons-group"
                sx={{ flexDirection: "row" }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Ativo"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Inativo"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          sx={{ background: "#1A4173" }}
        >
          Salvar Alterações
        </Button>
      </DialogActions>
    </>
  );
};

// 4. Exportar o componente
export default ModalForm;
