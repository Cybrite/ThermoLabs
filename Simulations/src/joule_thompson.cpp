#include "joule_thompson.hpp"
#include <iostream>
#include <random>

using namespace std;

// Noise function
double JouleThomsonSimulation::noise(double sigma) {
    static random_device rd;
    static mt19937 gen(rd());
    normal_distribution<> d(0, sigma);
    return d(gen);
}

// JT coefficient approximation
double JouleThomsonSimulation::compute_muJT(double T, double P) {
    return (1e-5) * (300.0 / T) * (P / 1e5);
}

// Constructor
JouleThomsonSimulation::JouleThomsonSimulation(double inletP, double outletP,
                                 double temp, double dt, double t_total) {
    P1 = inletP;
    P2 = outletP;
    T = temp;
    timeStep = dt;
    totalTime = t_total;
    currentTime = 0;
    muJT = compute_muJT(T, P1);
}

// One step simulation
void JouleThomsonSimulation::step() {
    if (currentTime >= totalTime) return;

    double dP = (P2 - P1) * (timeStep / totalTime);

    muJT = compute_muJT(T, P1);

    double dT = muJT * dP;

    dT += noise();
    dP += noise();

    T += dT;
    P1 += dP;
    currentTime += timeStep;
}

// Run simulation
void JouleThomsonSimulation::run() {
    cout << "Time\tPressure(Pa) \tTemperature(K)\n";

    while (currentTime < totalTime) {
        step();
        cout << currentTime << "\t" << P1 << "\t" << T << endl;
    }
}

// Display the result
void JouleThomsonSimulation::displayFinal() const {
    cout << endl << "Final State:" << endl;
    cout << "Pressure: " << P1 << " Pa" << endl;
    cout << "Temperature: " << T << " K" << endl;
}