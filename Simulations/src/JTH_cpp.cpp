#include "JTH.hpp"
#include <iostream>
#include <cmath>

JTH::JTH(double temp, double current, int time) {
    this->temp = temp;
    this->current = current;
    this->time = time;
}

void JTH::increase_current(double increment) {
    current += increment;
}

void JTH::decrease_current(double decrement) {
    current -= decrement;
}

void JTH::increase_voltage(double increment) {
    volt += increment;
}

void JTH::decrease_voltage(double decrement) {
    volt -= decrement;
}

double JTH::energy_supply() {
    return volt * current * time;
}

void JTH::temperature_new(double dissipation_energy, double a, double b, double c) {
    double net_energy = energy_supply() - dissipation_energy;
    
    double gaussian_term = a * std::exp(-std::pow(time - b, 2) / (2 * std::pow(c, 2)));
    
    temp = temp + (net_energy / (current * time)) + gaussian_term;
}