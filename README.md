# Zrobić animacje do loadingów(dużego i małego)


# idea

dodać animacje wsuwania karty profile podczas wszchodzenie na profil innego użytkownika w searchBar

# Zminić Post na różne odpowiadające jemy REST np DELETE,PUT,GET


# Do zmiany
# dodać wydajne doadawnie liczby podkomentarzy
W replies jest, hook count i diziała to na zasadzie, dodanie komentarze dodaje lub usunięcie zmienia wartość count. Funckja pobierania komentarzy pobiera jako parametr count i w useEffect count jest dodane do nasłuchiwania zmiań(gdy sie zmieni hook useEffect pobierze na nowo komentarze). Zmienić to na wydajny sposób, żeby nie trzeba było zawsze pobierać na nowo komenatrzy bo to niepotrzeben obciążnie.

# Likes/Comments number
dodać do nich usuwanie poprzedniej animacji przy spamowaniu


# Optymalizacja 
dodać do EditProfile funckję, która nie aktualizuje zdjęć kiedy nie są różne, ale nie robić tego w taki spobób jak poprzednio.


# Tip 
Zmienianie zdjęć w innym profilu niż nowy/ma zapisane zdjęcia w firebase, spowoduję błąd.
Nie chce mi się przeżucać zdjęć na firebase. I will do it leater!