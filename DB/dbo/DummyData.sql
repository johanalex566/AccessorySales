
INSERT INTO tblSuppliers
SELECT 'Jorge','Crr 120','4235678'

INSERT INTO tblProducts
SELECT 'MO','Mouse','Mouse alambrico',8,1.25,GETDATE(),'correo.com', (SELECT TOP  1 SupplierId tblSuppliers)

