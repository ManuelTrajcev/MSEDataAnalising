# Домашна 1

### Сите фајлови за прват домашна се наоѓаат во папката - DOMASNA_1
#### Папкат ги содржи фајловите: pipeline.py (главната скрипта, во која се повикуваат филтрите и се зачувуваат податоците), filters.py (трите филтри кои ги користиме), utils.py (потребни функции за scraping на податоците), data_from_previous_execution (папка во која се зачувани сите собрани податоци од претходно извршување на скриптите), all_data (папка во која се зачувуваат податоците од изврпување на скриптите, моментално празна за да може да се тестира програмата за собирање на сите податоци) и SRS документацијата.

## Извршување на скрипитите
  За да се изврши собирањето на податоците за сите компании од Македонската берза, преку Piepes and Filters архитектурата, потребно е да се изврши main методата од pipeline.py .
Со тоа како влезен аргумент во pipline се задава url од mse.mk кој се проследува на првиот филтер. Првиот филтер како резултат враќа листа со кодовите од сите достапни компании(исфилтритани само тие што не содржат броеви во името).
Оваа листа се предава на вториот филтер кој прави порверка на веќе постоечки податоци, зачувани кај нас локално (во all_data папката), доколку пронајде запис, ја зема датата од последниот зачуван податок, во спротивно враќа вредност None.
На третиот филтер му се предава листа, која содржи двојки (Комапнија, датум), доколку не пронајде последен запис, има вредност None. Третиот филтер итерира низ листат и проверува дали за компанијата има датум и ако има ги зема само новите податоци кои
недостигаат, во спротива (ако за датум има None) ги зема сите податоци од последните 10 години. За собирањето на податоците во филтер 3 е имплементиран multi threading, за побрзо извршување.
На крај се прави batch saving на податоците во csv фајлови. Податоците за секоја компанија се зачувуваат во посебен фајл во папката all_data. 
