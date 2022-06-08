CREATE PROCEDURE GetSuppliers
AS
BEGIN
	SELECT
		SupplierId,
		[Name],
		Adress, 
		PhoneNumber 
	FROM 
		tblSuppliers 
END
GO