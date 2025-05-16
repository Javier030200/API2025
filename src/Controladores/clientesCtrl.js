import{commysql} from '../bd.js'

export const obtenerClientes=(req,res)=>{
    res.send('Lista de clientes')
}

export const getClientes=async(req,res)=>{
    try{
        const [result]=await  commysql.query(' select *from clientes ')
        res.json({cant:result.length, data:result})
    } catch(error){
        return res.status(500).json({message:"error en el servidor"})
    }
}

//Retorn a cliente por id

export const getClientesxid=async(req,res)=>{
    try{
        
        const [result]=await  commysql.query(' select *from clientes where cli_id=?', [req.params.id])
        if(result.length<=0) return res.status(400).json({
            cli_id:0,
            message: " Cliente no encontrado"
        })
        res.json(result[0])
    } catch(error){
        return res.status(500).json({message:"error en el servidor"})
    }
}

//funcion para insertar un cliente
export const postClientes = async (req, res) => {
    try {
        console.log(req.body); // Verifica qué datos están llegando
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body;
        const [result] = await commysql.query("INSERT INTO clientes(cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) VALUES (?,?,?,?,?,?,?)",
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad]);
        res.send({
            id: result.insertId
        });
    } catch (error) {
        console.error(error); // Verifica el error completo
        return res.status(500).json({
            message: "Error al insertar cliente"
        });
    }
}

export const putClientes=async(req,res)=>{
        try{
            const {id}=req.params 
            const{cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad}=req.body
            //console.log(req.body)
            const [result]= await commysql.query(
                ' UPDATE clientes SET cli_identificacion= ? , cli_nombre=?, cli_telefono =?, cli_correo=?, cli_direccion=?, cli_pais=?, cli_ciudad =? WHERE cli_id=? ', 
                [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad,id])
                if(result.affectedRows<=0) return res.status(404).json({
                    message:"cliente no encontrado"
                });
                const[row] = await commysql.query(' select * from clientes where cli_id=? ', [id]);
                res.json(row[0]);
        }catch(error){
            return res.status(500).json({message: " error en el servidor "})
        }
    }

export const patchClientes=async(req,res)=>{
        try{
            const {id}=req.params 
            const{cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad}=req.body
            //console.log(req.body)
            const [result]= await commysql.query(
                ' UPDATE clientes SET cli_identificacion= IFNULL(?, cli_identificacion) , cli_nombre=IFNULL(?, cli_nombre), cli_telefono =IFNULL(?, cli_telefono), cli_correo=IFNULL(?, cli_correo), cli_direccion=IFNULL(?, cli_direccion), cli_pais=IFNULL(?, cli_pais), cli_ciudad =IFNULL(?, cli_ciudad) WHERE cli_id=? ', 
                [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad,id])
                if(result.affectedRows<=0) return res.status(404).json({
                    message:"cliente eno encontrado"
                });
                const[row] = await commysql.query(' select * from clientes where cli_id=? ', [id]);
                res.json(row[0]);
        }catch(error){
            return res.status(500).json({message: " error en el servidor "})
        }
    }

export const deleteClientes = async (req, res) => {
    try {
        const { id } = req.params;

        // Ejecuta la consulta para eliminar el cliente
        const [result] = await commysql.query('DELETE FROM clientes WHERE cli_id = ?', [id]);

        // Si no se afectó ninguna fila, significa que no se encontró el cliente
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Cliente no encontrado"
            });
        }

        // Respuesta exitosa
        res.json({
            message: "Cliente eliminado correctamente"
        });
    } catch (error) {
        console.error(error); // Muestra el error completo en consola para depuración
        return res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

