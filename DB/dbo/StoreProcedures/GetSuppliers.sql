CREATE PROCEDURE GetSuppliers
AS
BEGIN
	SELECT
		[Name],
		Adress, 
		PhoneNumber 
	FROM 
		tblSuppliers 
END
GO