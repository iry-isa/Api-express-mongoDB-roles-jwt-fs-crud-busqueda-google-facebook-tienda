-Login por roles donde los usuarios pueden escribir los articulos en la parte del blog para opinar y actualizar su perfil de usuarios siempre que estén autentificados y una vez que han opinado ya no pueden modificar ni borrar sin el Admin.
Los usuarios no pueden crear, actualizar y borrar productos o a otros usuarios.
Solo pueden obtener con un GET el producto por ID y todos los productos sin ser autentificados.No se le permite ver a los demás usuarios por privacidad.
CRUD de los productos solo lo puede hacer el administrador.El acceso esta restringido a traves de un middleware.

-Login tradicional jsonwebtoken con encriptacion de una sola via donde escondemos la contraseña detras de :).
-Login google
-Base de datos mongoDB utilizando los métodos de mongoose para crear, leer, actualizar y borrar.
-Tanto las publicaciones de articulos como la creacion de usuarios tiene implementada la fecha