#include <iostream>

class JTH{
    private :
    double temp, current, volt;
    int time;

    public:
    JTH(double, double, int);
    void increase_current(double);
    void decrease_current(double);
    void increase_voltage(double);
    void decrease_voltage(double);
    double energy_supply();
    void temperature_new(double, double, double, double);
    void display();
};