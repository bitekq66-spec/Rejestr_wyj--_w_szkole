# Specyfikacja wymagań oprogramowania (SRS)

## 1. Informacje o dokumencie

| Pole | Wartość |
| --- | --- |
| Nazwa systemu | Rejestr Wyjść Uczniów |
| Wersja dokumentu | 1.0 |
| Status | Projekt roboczy do zatwierdzenia przez szkołę |
| Data | 2026-10-14 |
| Przeznaczenie | Określenie wymagań funkcjonalnych i jakościowych aplikacji |

Dokument opisuje wymagania na podstawie aktualnej aplikacji oraz wskazuje kwestie, które wymagają decyzji właściciela systemu. Wymagania oznaczone jako „do uzgodnienia” nie są zatwierdzoną polityką szkoły.

## 2. Cel i zakres

System służy do ewidencjonowania wyjść uczniów z lekcji oraz ich powrotów, przeglądania historii i prezentowania podsumowań. System jest aplikacją internetową przeznaczoną dla uprawnionych pracowników szkoły.

Zakres obejmuje:

- logowanie pracowników i wylogowanie;
- przeglądanie klas, uczniów i historii wyjść;
- rejestrowanie rozpoczęcia i zakończenia wyjścia;
- prezentowanie danych i statystyk odpowiednich dla roli użytkownika;
- przechowywanie danych w usłudze Supabase.

Poza zakresem tej wersji, o ile szkoła nie zdecyduje inaczej: zarządzanie kadrami, ocenami, frekwencją, zgodami rodziców, planem lekcji oraz powiadomieniami SMS lub e-mail.

## 3. Terminologia

| Termin | Znaczenie |
| --- | --- |
| Wyjście | Zdarzenie rozpoczęte przez zapis czasu opuszczenia lekcji przez ucznia |
| Aktywne wyjście | Wyjście, dla którego nie zapisano jeszcze czasu powrotu |
| Wychowawca | Pracownik przypisany do klasy podopiecznej |
| Rola | Typ konta określający dostępny widok i zakres danych |
| Wpis | Rekord wyjścia ucznia wraz z czasem, lekcją, powodem i ewentualnym powrotem |

## 4. Użytkownicy i role

| Rola | Wymagany zakres funkcji |
| --- | --- |
| Nauczyciel | Wybór klasy i ucznia, przegląd historii ucznia, rejestrowanie wyjścia i powrotu |
| Wychowawca | Przegląd statystyk uczniów przypisanej klasy i ich wyjść |
| Dyrektor | Przegląd zbiorczych statystyk i aktywnych wyjść w szkole |
| Administrator | Przegląd zbiorczych danych systemu; zarządzanie kontami i danymi wymaga decyzji szkoły |

W aplikacji role są odczytywane z profilu pracownika. Obecne widoki administratora i dyrektora mają charakter podsumowujący. Szczegółowe uprawnienia do edycji lub usuwania danych należy zatwierdzić przed wdrożeniem.

## 5. Wymagania funkcjonalne

### 5.1. Uwierzytelnianie i sesja

- **FR-01:** System musi umożliwiać logowanie przy użyciu adresu e-mail i hasła.
- **FR-02:** System musi odrzucać nieprawidłowe dane logowania i wyświetlać komunikat, który nie ujawnia, czy konkretny adres e-mail jest zarejestrowany.
- **FR-03:** System musi umożliwiać wysłanie na podany adres e-mail instrukcji resetowania hasła.
- **FR-04:** System musi umożliwiać wylogowanie i zakończyć sesję użytkownika.
- **FR-05:** System może zapamiętać adres e-mail użytkownika na tym urządzeniu po wybraniu opcji „Zapamiętaj mnie”; nie może w ten sposób zapisywać hasła.
- **FR-06:** Po zalogowaniu system musi ustalić rolę użytkownika i udostępnić odpowiednie widoki.

### 5.2. Rejestr wyjść

- **FR-07:** System musi umożliwiać uprawnionemu nauczycielowi wybór klasy oraz wyświetlenie listy jej uczniów.
- **FR-08:** System musi umożliwiać wyszukiwanie uczniów na liście na podstawie imienia lub nazwiska.
- **FR-09:** Po wybraniu ucznia system musi wyświetlić historię jego wyjść, zawierającą datę, godzinę wyjścia, godzinę powrotu lub status aktywny, czas trwania oraz powód lub lekcję.
- **FR-10:** System musi umożliwiać rozpoczęcie nowego wyjścia dla wybranego ucznia po wskazaniu lekcji.
- **FR-11:** System musi zapisać czas rozpoczęcia wyjścia automatycznie w chwili utworzenia wpisu.
- **FR-12:** System musi umożliwiać podanie powodu wyjścia. Powód może być wybrany z listy szybkich opcji albo wpisany ręcznie; wymagalność tego pola wymaga zatwierdzenia przez szkołę.
- **FR-13:** System musi oznaczyć nowy wpis jako aktywny do czasu zapisania powrotu.
- **FR-14:** System musi umożliwiać zapisanie powrotu dla aktywnego wyjścia i automatycznie zapisać czas powrotu.
- **FR-15:** System musi obliczać czas trwania zakończonego wyjścia jako różnicę między czasem powrotu i wyjścia.
- **FR-16:** System musi umożliwiać usunięcie wpisu po potwierdzeniu tej operacji przez użytkownika. Role uprawnione do usuwania i wymagany ślad audytowy wymagają zatwierdzenia przez szkołę.
- **FR-17:** System powinien odświeżać wyświetlane dane po zmianie wpisu przez innego użytkownika, bez konieczności ponownego logowania.

### 5.3. Widoki i raportowanie

- **FR-18:** System musi wyświetlać nauczycielowi łączną liczbę wyjść ucznia, średni czas zakończonych wyjść oraz ich łączny czas.
- **FR-19:** System musi wyświetlać wychowawcy uczniów przypisanej klasy i statystyki wyjść, w tym wyjścia aktywne oraz podsumowania okresowe.
- **FR-20:** System musi wyświetlać dyrektorowi zbiorcze informacje o liczbie klas i uczniów, wyjściach w bieżącym miesiącu, zakończonych i aktywnych wyjściach.
- **FR-21:** System musi wyświetlać administratorowi zbiorcze informacje o liczbie klas i uczniów, wyjściach dzisiejszych i aktywnych oraz ostatnie wpisy.
- **FR-22:** System musi prezentować komunikat o braku danych lub błędzie pobierania, gdy nie można wyświetlić żądanych informacji.

## 6. Wymagania dotyczące danych

System operuje co najmniej na następujących encjach:

| Encja | Dane minimalne wynikające z aplikacji |
| --- | --- |
| Klasa | Identyfikator, nazwa |
| Uczeń | Identyfikator, imię, nazwisko, identyfikator klasy |
| Pracownik | Identyfikator, imię, nazwisko, adres e-mail, rola, opcjonalnie klasa podopieczna |
| Wyjście ucznia | Identyfikator, identyfikator ucznia, nazwa lekcji, powód, czas wyjścia, opcjonalny czas powrotu |

Wymagania walidacyjne:

- Każdy wpis wyjścia musi być powiązany z istniejącym uczniem.
- Czas powrotu nie może być wcześniejszy niż czas wyjścia.
- Zapis czasu powinien używać jednoznacznej strefy czasowej; prezentacja użytkownikowi powinna uwzględniać lokalną strefę szkoły.
- Okres przechowywania danych i sposób anonimizacji lub usuwania danych należy zatwierdzić przez szkołę.

## 7. Wymagania zewnętrzne i ograniczenia techniczne

- **INT-01:** Aplikacja webowa musi działać w przeglądarce użytkownika.
- **INT-02:** Uwierzytelnianie i dostęp do danych są realizowane z wykorzystaniem Supabase.
- **INT-03:** Interfejs musi być dostępny w języku polskim.
- **INT-04:** Aplikacja musi korzystać z konfiguracji środowiskowej dla adresu Supabase i klucza publicznego; sekrety serwerowe nie mogą być umieszczane w kodzie klienta.
- **INT-05:** Dostęp do rekordów musi być ograniczony regułami autoryzacji po stronie bazy danych, niezależnie od tego, jakie elementy interfejsu widzi użytkownik.

## 8. Wymagania niefunkcjonalne

- **NFR-01 Bezpieczeństwo:** Dostęp do funkcji i danych musi być zgodny z rolą oraz zakresem uprawnień użytkownika. Próba dostępu do niedozwolonych danych musi zostać odrzucona przez warstwę danych, a nie tylko ukryta w interfejsie.
- **NFR-02 Prywatność:** System musi ograniczać dostęp do danych uczniów do osób upoważnionych. Szkoła musi określić podstawę i okres przechowywania danych oraz procedurę ich usuwania.
- **NFR-03 Poufność:** Hasła nie mogą być przechowywane przez aplikację w postaci jawnej ani zapisywane jako „zapamiętane” dane logowania.
- **NFR-04 Integralność:** Błąd zapisu nie może być prezentowany jako udana rejestracja; użytkownik musi otrzymać informację o niepowodzeniu.
- **NFR-05 Użyteczność:** Operacje rozpoczęcia wyjścia i zapisania powrotu muszą być dostępne z widoku rejestru i czytelnie rozróżniać wpisy aktywne od zakończonych.
- **NFR-06 Dostępność:** Interfejs powinien być obsługiwalny na ekranach komputerów i urządzeń mobilnych oraz z klawiatury.
- **NFR-07 Wydajność:** Docelowy czas ładowania listy uczniów i historii przy typowym obciążeniu wymaga uzgodnienia z właścicielem systemu i sprawdzenia na wdrożonym środowisku.
- **NFR-08 Odzyskiwanie:** Kopie zapasowe bazy, dopuszczalny czas odtworzenia i dopuszczalna utrata danych wymagają określenia przez administratora systemu.

## 9. Główne scenariusze użycia

### UC-01: Rejestrowanie wyjścia ucznia

1. Nauczyciel loguje się do systemu.
2. Wybiera klasę i ucznia.
3. Wybiera lekcję, opcjonalnie podaje powód i zatwierdza dodanie wyjścia.
4. System zapisuje wpis z bieżącym czasem i statusem aktywnym.
5. System odświeża historię ucznia i prezentuje nowy wpis.

### UC-02: Rejestrowanie powrotu ucznia

1. Nauczyciel otwiera historię wybranego ucznia.
2. Przy aktywnym wpisie wybiera akcję zapisania powrotu.
3. System zapisuje bieżący czas powrotu i oblicza czas trwania.
4. Wpis przestaje być prezentowany jako aktywny.

### UC-03: Przegląd statystyk klasy

1. Wychowawca loguje się do systemu.
2. System identyfikuje przypisaną klasę.
3. System wyświetla listę uczniów i statystyki ich wyjść.
4. Jeżeli brak przypisanej klasy lub danych, system wyświetla zrozumiały komunikat.

## 10. Kryteria akceptacji

- Użytkownik z poprawnymi danymi logowania uzyskuje dostęp do widoku zgodnego ze swoją rolą; użytkownik z błędnymi danymi nie uzyskuje dostępu.
- Po dodaniu wyjścia pojawia się ono w historii z czasem wyjścia i statusem aktywnym.
- Po zapisaniu powrotu wpis pokazuje czas powrotu i obliczony czas trwania.
- Usunięcie wpisu wymaga potwierdzenia i po udanym zapisie usuwa go z widoku historii.
- Wychowawca widzi wyłącznie dane klasy dopuszczonej przez zatwierdzoną politykę dostępu.
- Próba odczytu lub modyfikacji niedozwolonych danych bez uprawnień jest blokowana przez bazę danych.
- Widoki zbiorcze pokazują wartości zgodne z wpisami źródłowymi i przyjętym zakresem dat.

## 11. Kwestie do zatwierdzenia

1. Czy nauczyciel może przeglądać i rejestrować wyjścia wszystkich klas, czy tylko przydzielonych?
2. Czy wychowawca może również korzystać z rejestru, czy wyłącznie z panelu swojej klasy?
3. Czy administrator i dyrektor mogą przeglądać szczegóły konkretnych uczniów, czy tylko raporty zagregowane?
4. Które role mogą usuwać wpisy? Czy usunięcie ma być trwałe, czy wpis powinien być jedynie unieważniany z zachowaniem historii zmian?
5. Czy powód wyjścia jest wymagany? Czy lista lekcji i powodów ma być konfigurowana przez szkołę?
6. Czy uczeń może mieć więcej niż jedno aktywne wyjście jednocześnie?
7. Jaki jest okres przechowywania wpisów, kto może go zmieniać i jak obsłużyć koniec roku szkolnego?
8. Jakie docelowe czasy odpowiedzi, wymagania dostępności, kopii zapasowych i odtwarzania obowiązują?
9. Kto zatwierdza konta i przypisuje role oraz klasy podopieczne?
10. Jakie wymagania prawne i procedury szkoły dotyczą danych osobowych uczniów oraz audytowania dostępu?

## 12. Powiązanie wymagań z aplikacją

Dokument opracowano na podstawie istniejących ekranów logowania, rejestru, panelu wychowawcy, paneli administratora i dyrektora, logiki aplikacji oraz usług danych. Implementacja nie jest sama w sobie potwierdzeniem zgodności z wymaganiami bezpieczeństwa. W szczególności reguły dostępu w Supabase, role uprawnione do kasowania oraz retencja danych wymagają osobnej weryfikacji i zatwierdzenia.