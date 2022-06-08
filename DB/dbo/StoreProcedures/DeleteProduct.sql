CREATE PROCEDURE DeleteProduct(@ProductId INT)
AS BEGIN
	DELETE FROM tblProducts WHERE ProductId =@ProductId
END