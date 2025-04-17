import React from 'react';
import './ViajeDetalle.css';
import Swal from 'sweetalert2';

const ViajeDetalle = ({ route, date, returnDate, passengers, origin, destination }) => {
    const abrirWhatsApp = (originStop, destinationStop, price, empresa) => {
        const numero = "5491139505311";
        let mensaje = `Hola, quiero consultar por un viaje con ${empresa}:\n\n *Origen:* ${originStop?.nombre || "No especificado"}\n *Destino:* ${destinationStop?.nombre || "No especificado"}\n *Fecha de ida:* ${date || "Cualquier fecha"}`;

        if (returnDate) {
            mensaje += `\n↩️ *Fecha de regreso:* ${returnDate}`;
        }

        mensaje += `\n *Cantidad de pasajeros:* ${passengers}`;

        if (price) {
            if (price.semiCama) mensaje += `\n *Precio semi-cama:* ARS${price.semiCama}`;
            if (price.cama) mensaje += `\n *Precio cama:* ARS${price.cama}`;
            if (price.estandar) mensaje += `\n *Precio estándar:* ARS${price.estandar}`;
            if (price.promoGeneral) mensaje += `\n *Promoción:* ${price.promoGeneral}`;
        }

        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWeb = `https://wa.me/${numero}?text=${mensajeCodificado}`;
        const urlApp = `whatsapp://send?phone=${numero}&text=${mensajeCodificado}`;

        // Mostrar alerta antes de redirigir a WhatsApp
        Swal.fire({
            icon: 'success',
            title: 'Consulta lista para enviar',
            text: 'Serás redirigido a WhatsApp para enviar tu consulta y poder realizar la compra.',
            confirmButtonText: 'Ir a WhatsApp'
        }).then((result) => {
            if (result.isConfirmed) {
                if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                    window.location.href = urlApp;
                } else {
                    window.open(urlWeb, "_blank");
                }
            }
        });
    };


    const paradas1 = route.paradas.paradas1;
    const paradas2 = route.paradas.paradas2;

    let originStopResult = null;
    let destinationStopResult = null;

    const originStop1Result = paradas1.find(p => p.nombre === origin?.value); // Access origin.value safely
    const originStop2Result = paradas2.find(p => p.nombre === origin?.value); // Access origin.value safely
    const destinationStop1Result = paradas1.find(p => p.nombre === destination?.value); // Access destination.value safely
    const destinationStop2Result = paradas2.find(p => p.nombre === destination?.value); // Access destination.value safely

    if (originStop1Result && destinationStop2Result) {
        originStopResult = originStop1Result;
        destinationStopResult = destinationStop2Result;
    } else if (originStop2Result && destinationStop1Result) {
        originStopResult = originStop2Result;
        destinationStopResult = destinationStop1Result;
    }

    let priceToUse = null;

    if (destinationStopResult && (destinationStopResult.precioSemi || destinationStopResult.precioCama || destinationStopResult.precioEstandar || destinationStopResult.precioPromo)) {
        priceToUse = {
            semiCama: destinationStopResult.precioSemi,
            cama: destinationStopResult.precioCama,
            estandar: destinationStopResult.precioEstandar,
            promo: destinationStopResult.precioPromo
        };
    } else if (originStopResult && (originStopResult.precioSemi || originStopResult.precioCama || originStopResult.precioEstandar || originStopResult.precioPromo)) {
        priceToUse = {
            semiCama: originStopResult.precioSemi,
            cama: originStopResult.precioCama,
            estandar: originStopResult.precioEstandar,
            promo: originStopResult.precioPromo
        };
    }



    return (
        <div className="detalleViaje">
            <div className="viaje-header">
                {route.img && <img src={route.img} alt={`Logo de ${route.empresa}`} />}
            </div>
            <div className="viajeInfo">
                <div><p>{originStopResult?.nombre}</p></div>
                <div>
                    <img src="./img/flecha.png" alt="" />
                </div>
                <div><p>{destinationStopResult?.nombre}</p></div>
            </div>
            <div className="precios">
                {priceToUse?.semiCama && (
                    <div className='precio-container'> {/* Nuevo contenedor */}
                        <h6><span>SEMICAMA</span></h6>
                        <div className='precioDetalle'>
                            <h3><span>DESDE</span></h3>
                            <h3><span>$</span> <b>{priceToUse?.semiCama}</b></h3>
                        </div>
                    </div>
                )}
                {priceToUse?.cama && (
                    <div className='precio-container'> {/* Nuevo contenedor */}
                        <h6><span>CAMA</span></h6>
                        <div className='precioDetalle'>
                            <h3><span>DESDE</span></h3>
                            <h3><span>$</span> <b>{priceToUse?.cama}</b></h3>
                        </div>
                    </div>
                )}
                {priceToUse?.estandar && (
                    <div className='precio-container'> {/* Nuevo contenedor */}
                        <h6><span>ESTANDAR</span></h6>
                        <div className='precioDetalle'>
                            <h3><span>DESDE</span></h3>
                            <h3><span>$</span> <b>{priceToUse?.estandar}</b></h3>
                        </div>
                    </div>
                )}
                  {priceToUse?.promo && (
                    <div className='precio-container'> {/* Nuevo contenedor */}
                        <h6><span>PROMO 🔥</span></h6>
                        <div className='precioDetalle'>
                            <h3><span>DESDE</span></h3>
                            <h3><span>$</span> <b>{priceToUse?.promo}</b></h3>
                        </div>
                    </div>
                )}

            </div>

            <div className='desktopbtn'>

                <div>
                    <div className='notaBaja'>
                        <h2>Precios por tramo</h2>
                    </div>
                </div>
                <div>

                    {priceToUse && (
                        <button onClick={() => abrirWhatsApp(originStopResult, destinationStopResult, priceToUse, route.empresa)} className="whatsapp-btn">
                            <img src="./img/wap.png" alt="" />
                            Consultar
                        </button>
                    )}
                </div>

            </div>


        </div>
    );
};

export default ViajeDetalle;