CREATE TABLE tblProducts
(
ProductId INT IDENTITY PRIMARY KEY,
Code VARCHAR(20),
[Name] VARCHAR(100),
[Description] VARCHAR(100),
Stock INT,
[Value] DECIMAL,
CreationDate DATETIME DEFAULT GETDATE(),
SupplierId INT,
FOREIGN KEY (SupplierId) REFERENCES tblSuppliers(SupplierId)
)
